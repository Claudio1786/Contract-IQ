variable "project_name" {
  description = "Base name applied to Azure resources."
  type        = string
  default     = "contract-iq"
}

variable "environment" {
  description = "Deployment environment identifier (e.g., dev, qa, prod)."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region name."
  type        = string
  default     = "eastus"
}

variable "container_image" {
  description = "Fully qualified container image for the API service."
  type        = string
}

variable "container_port" {
  description = "Internal port exposed by the container image."
  type        = number
  default     = 8000
}

variable "key_vault_admin_object_ids" {
  description = "List of Azure AD object IDs granted admin access to Key Vault."
  type        = list(string)
  default     = []
}

variable "postgres_admin_username" {
  description = "Administrator username for Postgres flexible server."
  type        = string
  default     = "contractiq_admin"
}

variable "postgres_admin_password" {
  description = "Administrator password for Postgres flexible server."
  type        = string
  sensitive   = true
}

variable "postgres_sku_name" {
  description = "Azure SKU for Postgres flexible server."
  type        = string
  default     = "Standard_D2ds_v4"
}

variable "postgres_storage_mb" {
  description = "Allocated storage in MB for Postgres flexible server."
  type        = number
  default     = 32768
}

variable "tags" {
  description = "Additional tags applied to resources."
  type        = map(string)
  default     = {}
}
