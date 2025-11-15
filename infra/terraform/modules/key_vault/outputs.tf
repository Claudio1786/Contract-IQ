output "id" {
  value       = azurerm_key_vault.this.id
  description = "Key Vault resource ID."
}

output "uri" {
  value       = azurerm_key_vault.this.vault_uri
  description = "Key Vault URI used for secret resolution."
}

output "secret_name" {
  value       = var.secret_name
  description = "Name of the secret seeded in the vault (if any)."
}
