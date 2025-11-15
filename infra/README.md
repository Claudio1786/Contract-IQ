# Infrastructure Overview

This directory contains the infrastructure-as-code and deployment automation used to host Contract IQ in Azure.

## Terraform Layout

```
infra/
  terraform/
    main.tf             # Root stack wiring Azure resources together
    providers.tf        # Required providers and backend configuration
    variables.tf        # Input variables for the stack
    outputs.tf          # Surface connection metadata for downstream services
    terraform.tfvars.example
    modules/
      container_app/    # Azure Container Apps workload scaffold
      key_vault/        # Key Vault for application secrets
      postgres/         # Flexible Server for contract storage
```

### Environments

At this stage we ship a single environment scaffold (`dev`). Additional environments can be layered by instantiating separate workspaces or state files with distinct variable overrides.

### Quick Start

```bash
cd infra/terraform
terraform init
terraform plan -var-file="terraform.tfvars" -out="tfplan"
terraform apply "tfplan"
```

Refer to `terraform.tfvars.example` for required variable inputs. Copy it to `terraform.tfvars` and update values before running `terraform plan`.

The example tfvars expects:

- `project_name` / `environment` to create resource name prefixes
- Azure Container App image reference (e.g. `ghcr.io/<org>/contract-iq-api:latest`)
- Postgres admin credentials and SKU configuration
- (Optional) administrator object IDs for Key Vault access policies

Authenticate with Azure (`az login`) prior to running Terraform so that the provider can resolve your subscription and tenant context.

### Module Responsibilities

- **modules/container_app** provisions an Azure Container App with a system-assigned managed identity, public ingress, and environment variables. It pulls the database connection string from Key Vault and exposes the ingress FQDN for routing.
- **modules/postgres** provisions an Azure PostgreSQL Flexible Server plus a default application database. It outputs a connection string that is injected into Key Vault.
- **modules/key_vault** creates an Azure Key Vault, grants administrator access to supplied object IDs, and seeds the Postgres connection secret when provided.

The root module also establishes a Container App Environment, Log Analytics workspace, and a managed identity access policy binding so the workload can read secrets at runtime.

### Secrets & Configuration

The Key Vault module seeds the secret `postgres-connection-string` by default. The Container App module stores that secret as `DATABASE_URL`, making it available to the FastAPI service. Additional environment variables can be passed through `environment_variables` in `main.tf` or by extending the module interface.

To rotate database credentials, update the Key Vault secret and redeploy the container app revision. Terraform will reconcile changes when `terraform apply` is re-run with new credentials.

### Outputs & Verification

After a successful apply, inspect outputs:

```bash
terraform output
```

Key values include the Container App FQDN, Postgres FQDN, and Key Vault URI. Use these to configure DNS, connect application clients, or validate the deployment via the `/health` endpoint.

### CI Integration

GitHub Actions workflows validate Terraform formatting and run `terraform plan` in check mode. API tests execute via Poetry to keep backend regression coverage in lock-step with infrastructure changes.
