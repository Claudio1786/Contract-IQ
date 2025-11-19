variable "name" {
  description = "Name of the Postgres flexible server."
  type        = string
}

variable "resource_group_name" {
  description = "Resource group for the Postgres server."
  type        = string
}

variable "location" {
  description = "Azure region for the Postgres server."
  type        = string
}

variable "admin_username" {
  description = "Administrator username for the server."
  type        = string
}

variable "admin_password" {
  description = "Administrator password for the server."
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "Azure SKU for compute provisioning."
  type        = string
  default     = "Standard_D2ds_v4"
}

variable "storage_mb" {
  description = "Allocated storage size in MB."
  type        = number
  default     = 32768
}

variable "database_name" {
  description = "Default database created for the application."
  type        = string
  default     = "contractiq"
}

variable "availability_zone" {
  description = "Optional availability zone for the server."
  type        = string
  default     = null
}

variable "backup_retention_days" {
  description = "Retention period for backups."
  type        = number
  default     = 7
}

variable "tags" {
  description = "Tags applied to Postgres resources."
  type        = map(string)
  default     = {}
}
