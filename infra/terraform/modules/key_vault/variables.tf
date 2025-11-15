variable "name" {
  description = "Globally unique name for the Key Vault."
  type        = string
}

variable "resource_group_name" {
  description = "Resource group hosting the Key Vault."
  type        = string
}

variable "location" {
  description = "Azure region where the Key Vault resides."
  type        = string
}

variable "tenant_id" {
  description = "Azure Active Directory tenant ID."
  type        = string
}

variable "access_object_ids" {
  description = "Principal object IDs granted administrator permissions."
  type        = list(string)
  default     = []
}

variable "sku_name" {
  description = "Key Vault SKU name."
  type        = string
  default     = "standard"
}

variable "secret_name" {
  description = "Optional secret name to seed with application data."
  type        = string
  default     = null
}

variable "secret_value" {
  description = "Optional secret value stored when provided."
  type        = string
  default     = null
  sensitive   = true
}

variable "tags" {
  description = "Tags applied to the Key Vault resources."
  type        = map(string)
  default     = {}
}
