resource "azurerm_key_vault" "this" {
  name                        = var.name
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = var.tenant_id
  sku_name                    = var.sku_name
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  enabled_for_deployment      = true
  enabled_for_disk_encryption = true
  enabled_for_template_deployment = true
  tags                        = var.tags

  dynamic "access_policy" {
    for_each = toset(var.access_object_ids)
    content {
      tenant_id = var.tenant_id
      object_id = access_policy.value

      secret_permissions = [
        "Get",
        "List",
        "Set",
        "Delete",
        "Recover",
        "Backup",
        "Restore"
      ]
    }
  }
}

resource "azurerm_key_vault_secret" "seed" {
  count        = var.secret_name != null && var.secret_value != null ? 1 : 0
  name         = var.secret_name
  value        = var.secret_value
  key_vault_id = azurerm_key_vault.this.id

  depends_on = [azurerm_key_vault.this]
}
