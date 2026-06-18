output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.app.public_ip
}

output "security_group_id" {
  description = "ID of the EC2 instance security group"
  value       = aws_security_group.app.id
}
