resource "azurerm_container_app" "this" {
  name                         = var.name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = var.environment_id
  location                     = var.location
  revision_mode                = "Single"
  tags                         = var.tags

  identity {
    type = "SystemAssigned"
  }

  ingress {
    external_enabled = var.ingress_external
    target_port      = var.target_port
    transport        = "auto"
  }

  secret {
    name = var.database_secret_name
    key_vault_secret_reference {
      key_vault_id = var.key_vault_id
      secret_name  = var.key_vault_secret
    }
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = var.container_name
      image  = var.image
      cpu    = var.cpu
      memory = var.memory

      env {
        name        = var.database_env_variable
        secret_name = var.database_secret_name
      }

      dynamic "env" {
        for_each = var.environment_variables
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
}
