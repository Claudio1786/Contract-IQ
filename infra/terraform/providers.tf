terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.113"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
}

# Uncomment to configure remote state storage (e.g., Azure Blob Storage)
# backend "azurerm" {
#   resource_group_name  = "rg-terraform-state"
#   storage_account_name = "tfstateaccount"
#   container_name       = "state"
#   key                  = "contract-iq/${terraform.workspace}.tfstate"
# }
