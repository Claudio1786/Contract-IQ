variable "name" {
  description = "Name of the container app instance."
  type        = string
}

variable "resource_group_name" {
  description = "Resource group where the container app is deployed."
  type        = string
}

variable "location" {
  description = "Azure region for the container app."
  type        = string
}

variable "environment_id" {
  description = "Azure Container Apps environment identifier."
  type        = string
}

variable "image" {
  description = "Container image to deploy."
  type        = string
}

variable "target_port" {
  description = "Port exposed by the container for ingress routing."
  type        = number
  default     = 8000
}

variable "container_name" {
  description = "Logical name of the container inside the app."
  type        = string
  default     = "contract-iq-api"
}

variable "cpu" {
  description = "vCPU allocated to the container."
  type        = number
  default     = 0.5
}

variable "memory" {
  description = "Memory allocated to the container (Gi)."
  type        = string
  default     = "1Gi"
}

variable "min_replicas" {
  description = "Minimum number of active replicas."
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "Maximum number of active replicas."
  type        = number
  default     = 3
}

variable "ingress_external" {
  description = "Expose the workload over a public endpoint when true."
  type        = bool
  default     = true
}

variable "environment_variables" {
  description = "Plain environment variables injected into the container."
  type        = map(string)
  default     = {}
}

variable "database_env_variable" {
  description = "Environment variable key used for the database connection string."
  type        = string
  default     = "DATABASE_URL"
}

variable "database_secret_name" {
  description = "Secret name used inside the container app to reference Key Vault secret."
  type        = string
  default     = "database-url"
}

variable "key_vault_id" {
  description = "Azure Key Vault resource ID containing environment secrets."
  type        = string
}

variable "key_vault_secret" {
  description = "Name of the Key Vault secret storing the database connection string."
  type        = string
}

variable "tags" {
  description = "Tags propagated to the container app."
  type        = map(string)
  default     = {}
}
