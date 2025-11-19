output "id" {
  value       = azurerm_container_app.this.id
  description = "Container App resource ID."
}

output "fqdn" {
  value       = try(azurerm_container_app.this.ingress[0].fqdn, null)
  description = "Public fully-qualified domain name for ingress."
}

output "identity_principal_id" {
  value       = try(azurerm_container_app.this.identity[0].principal_id, null)
  description = "Managed identity principal ID granted to the container app."
}
