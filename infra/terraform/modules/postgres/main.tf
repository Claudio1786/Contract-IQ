resource "azurerm_postgresql_flexible_server" "this" {
  name                          = var.name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  sku_name                      = var.sku_name
  storage_mb                    = var.storage_mb
  version                       = "16"
  administrator_login           = var.admin_username
  administrator_password        = var.admin_password
  zone                          = var.availability_zone
  public_network_access_enabled = true
  tags                          = var.tags

  backup {
    retention_days            = var.backup_retention_days
    geo_redundant_backup_enabled = false
  }

  high_availability {
    mode = "Disabled"
  }

  authentication {
    password_auth_enabled = true
  }
}

resource "azurerm_postgresql_flexible_database" "app" {
  name                = var.database_name
  resource_group_name = var.resource_group_name
  server_name         = azurerm_postgresql_flexible_server.this.name
  charset             = "UTF8"
  collation           = "en_US.UTF8"
}

locals {
  connection_string = format(
    "postgresql://%s:%s@%s:5432/%s",
    var.admin_username,
    var.admin_password,
    azurerm_postgresql_flexible_server.this.fqdn,
    var.database_name
  )
}
