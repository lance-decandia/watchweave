import requests
import psycopg2
import os
import math
from collections import Counter

JIKAN_BASE = 'https://api.jikan.moe/v4'

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', 5432),
        database=os.getenv('DB_NAME', 'watchweave'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', '')
    )

def get_user_genre_vector(user_id):
    print(f"Getting genre vector for user {user_id}", flush=True)
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT anime_id, status FROM watchlist WHERE user_id = %s", (user_id,))
        watchlist = cur.fetchall()
        cur.close()
        conn.close()
        print(f"Found {len(watchlist)} items in watchlist", flush=True)
    except Exception as e:
        print(f"DB connection error: {e}", flush=True)
        return {}, []

    if not watchlist:
        return {}, []

    status_weights = {
        'completed': 3,
        'watching': 2,
        'plan_to_watch': 1,
        'dropped': 0
    }

    genre_vector = Counter()
    watched_ids = []

    for anime_id, status in watchlist:
        watched_ids.append(anime_id)
        weight = status_weights.get(status, 1)
        if weight == 0:
            continue
        try:
            res = requests.get(f'{JIKAN_BASE}/anime/{anime_id}', timeout=5)
            if res.status_code == 200:
                genres = res.json().get('data', {}).get('genres', [])
                for genre in genres:
                    genre_vector[genre['name']] += weight
                print(f"Got genres for anime {anime_id}: {[g['name'] for g in genres]}", flush=True)
            else:
                print(f"Jikan returned {res.status_code} for anime {anime_id}", flush=True)
        except Exception as e:
            print(f"Jikan error for anime {anime_id}: {e}", flush=True)
            continue

    return dict(genre_vector), watched_ids

def cosine_similarity(vec1, vec2):
    if not vec1 or not vec2:
        return 0.0
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum(vec1[x] * vec2[x] for x in intersection)
    sum1 = sum(v ** 2 for v in vec1.values())
    sum2 = sum(v ** 2 for v in vec2.values())
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    return numerator / denominator if denominator else 0.0

def get_recommendations(user_id, limit=12):
    genre_vector, watched_ids = get_user_genre_vector(user_id)
    print(f"Genre vector: {genre_vector}", flush=True)

    if not genre_vector:
        print("No genre vector, falling back to top anime", flush=True)
        try:
            res = requests.get(f'{JIKAN_BASE}/top/anime', timeout=10)
            print(f"Top anime response: {res.status_code}", flush=True)
            if res.status_code == 200:
                return res.json().get('data', [])[:limit]
        except Exception as e:
            print(f"Top anime error: {e}", flush=True)
        return []

    top_genres = sorted(genre_vector.items(), key=lambda x: x[1], reverse=True)[:3]
    candidates = []

    for genre_name, _ in top_genres:
        try:
            res = requests.get(f'{JIKAN_BASE}/anime',
                params={'genres': genre_name, 'order_by': 'score', 'sort': 'desc', 'limit': 10},
                timeout=10)
            if res.status_code == 200:
                candidates.extend(res.json().get('data', []))
                print(f"Got {len(res.json().get('data', []))} candidates for genre {genre_name}", flush=True)
        except Exception as e:
            print(f"Genre search error for {genre_name}: {e}", flush=True)
            continue

    scored = []
    seen_ids = set(watched_ids)

    for anime in candidates:
        if anime['mal_id'] in seen_ids:
            continue
        seen_ids.add(anime['mal_id'])
        anime_genres = {g['name']: 1 for g in anime.get('genres', [])}
        score = cosine_similarity(genre_vector, anime_genres)
        scored.append((score, anime))

    scored.sort(key=lambda x: x[0], reverse=True)
    print(f"Returning {len(scored[:limit])} recommendations", flush=True)
    return [anime for _, anime in scored[:limit]]
