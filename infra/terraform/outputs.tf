output "resource_group_name" {
  description = "Azure resource group hosting Contract IQ resources."
  value       = azurerm_resource_group.main.name
}

output "container_app_fqdn" {
  description = "Public endpoint for the Contract IQ API container app."
  value       = module.container_app.fqdn
}

output "postgres_fqdn" {
  description = "Hostname for the managed Postgres instance."
  value       = module.postgres.fqdn
}

output "postgres_database" {
  description = "Database created for the application."
  value       = module.postgres.database_name
}

output "key_vault_uri" {
  description = "URI used to address the environment Key Vault."
  value       = module.key_vault.uri
}
