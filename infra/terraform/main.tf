data "azurerm_client_config" "current" {}

resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

locals {
  base_prefix        = lower(replace("${var.project_name}-${var.environment}", "_", "-"))
  tags               = merge({
    Project     = var.project_name
    Environment = var.environment
  }, var.tags)
  workspace_name     = "${local.base_prefix}-${random_string.suffix.result}-log"
  container_env_name = "${local.base_prefix}-${random_string.suffix.result}-env"
  key_vault_name     = lower(substr("${regexreplace(var.project_name, "[^A-Za-z0-9]", "")}${regexreplace(var.environment, "[^A-Za-z0-9]", "")}${random_string.suffix.result}", 0, 24))
}

resource "azurerm_resource_group" "main" {
  name     = "${local.base_prefix}-rg"
  location = var.location
  tags     = local.tags
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = local.workspace_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_container_app_environment" "main" {
  name                       = local.container_env_name
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  tags                       = local.tags
}

module "postgres" {
  source = "./modules/postgres"

  name                = "${local.base_prefix}-pgsql"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  admin_username      = var.postgres_admin_username
  admin_password      = var.postgres_admin_password
  sku_name            = var.postgres_sku_name
  storage_mb          = var.postgres_storage_mb
  tags                = local.tags
}

module "key_vault" {
  source = "./modules/key_vault"

  name                = local.key_vault_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  access_object_ids   = var.key_vault_admin_object_ids
  secret_name         = "postgres-connection-string"
  secret_value        = module.postgres.connection_string
  tags                = local.tags
}

module "container_app" {
  source = "./modules/container_app"

  name                = "${local.base_prefix}-api"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment_id      = azurerm_container_app_environment.main.id
  image               = var.container_image
  target_port         = var.container_port
  key_vault_id        = module.key_vault.id
  key_vault_secret    = module.key_vault.secret_name
  tags                = local.tags

  environment_variables = {
    "ENVIRONMENT" = var.environment
  }
}

resource "azurerm_key_vault_access_policy" "container_app" {
  key_vault_id = module.key_vault.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = module.container_app.identity_principal_id

  secret_permissions = [
    "Get",
    "List"
  ]

  depends_on = [module.container_app]
}
