output "ecr_backend_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_recommendations_url" {
  value = aws_ecr_repository.recommendations.repository_url
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "frontend_url" {
  value = "http://${aws_lb.main.dns_name}"
}

output "backend_url" {
  value = "http://${aws_lb.main.dns_name}:3000"
}
