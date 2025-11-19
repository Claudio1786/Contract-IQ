output "id" {
  value       = azurerm_postgresql_flexible_server.this.id
  description = "Postgres flexible server resource ID."
}

output "fqdn" {
  value       = azurerm_postgresql_flexible_server.this.fqdn
  description = "Fully qualified domain name of the server."
}

output "database_name" {
  value       = azurerm_postgresql_flexible_database.app.name
  description = "Database created for Contract IQ."
}

output "connection_string" {
  value       = local.connection_string
  sensitive   = true
  description = "Connection string for the application database."
}
