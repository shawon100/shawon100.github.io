export const blogPosts = [
  {
    id: 1,
    slug: 'zero-downtime-kubernetes-deployments-azure',
    title: 'Zero-Downtime Deployments on Azure AKS: A Production Guide',
    excerpt: 'How I reduced deployment-related incidents to zero on a 15+ microservice platform using rolling updates, PodDisruptionBudgets, readiness probes, and Azure Application Gateway health checks.',
    date: '2024-11-10',
    readTime: '8 min read',
    tags: ['Kubernetes', 'Azure', 'AKS', 'DevOps'],
    category: 'Kubernetes',
    content: `
## The Problem

Running a multi-tenant SaaS platform in Canada with 15+ microservices means deployments can't afford downtime. Early in my role at LTIMindtree, we had a 3% error spike on every release window. Here's how I fixed it on Azure AKS.

## Strategy 1: Rolling Update Configuration

The default Kubernetes rolling update is insufficient for high-traffic services. Set these explicitly:

\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0        # Never take a pod down before a new one is ready
      maxSurge: 1              # Only spin up 1 extra pod at a time
\`\`\`

Setting \`maxUnavailable: 0\` is the single most impactful change. It ensures no traffic is dropped.

## Strategy 2: Readiness Probes (Not Just Liveness)

Most teams configure liveness probes but skip readiness probes. A pod isn't ready until it can actually serve traffic:

\`\`\`yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
\`\`\`

Your app's \`/health/ready\` endpoint should check database connections, cache warmup, and any dependencies. Only return 200 when truly ready.

## Strategy 3: PodDisruptionBudgets

Protect against node drains and voluntary disruptions:

\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-service-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api-service
\`\`\`

This ensures at least 2 replicas are always available, even during cluster upgrades or node maintenance.

## Strategy 4: Azure Application Gateway Health Probes

Configure the App Gateway health probe to match your readiness endpoint — not just a TCP check. This stops the gateway from routing to pods that are starting up.

## Results

After implementing all four strategies across 15 microservices, we achieved:
- **0 deployment-related incidents** over 6 months
- **50% faster deployment pipeline** due to parallel rollouts
- **30% cost reduction** from right-sized replica counts backed by HPA

---

*This approach is now my standard template for any new AKS workload I set up in Canada or globally.*
    `,
  },
  {
    id: 2,
    slug: 'jenkins-to-github-actions-migration-guide',
    title: 'Migrating from Jenkins to GitHub Actions: Lessons from the Trenches',
    excerpt: 'A real-world migration playbook covering pipeline translation patterns, secret management, self-hosted runners on Azure VMs, and the gotchas nobody writes about.',
    date: '2024-09-05',
    readTime: '10 min read',
    tags: ['GitHub Actions', 'Jenkins', 'CI/CD', 'Migration'],
    category: 'CI/CD',
    content: `
## Why Migrate?

Jenkins works. But maintaining a Jenkins master, managing plugins, and writing Groovy pipelines has real overhead. After migrating multiple teams from Jenkins to GitHub Actions, here's the honest playbook.

## Step 1: Audit Your Jenkins Pipelines First

Before writing a single workflow YAML, catalog what you have:

\`\`\`bash
# Export all Jenkins job configs
for job in $(curl -s http://jenkins/api/json | jq -r '.jobs[].name'); do
  curl -s "http://jenkins/job/$job/config.xml" > "jobs/$job.xml"
done
\`\`\`

Categorize by: build-only, test-only, deploy, multi-stage. This shapes your GitHub Actions strategy.

## Step 2: Map Jenkins Concepts to GitHub Actions

| Jenkins | GitHub Actions |
|---------|---------------|
| Jenkinsfile | .github/workflows/*.yml |
| Stage | job |
| Step | step |
| Agent | runs-on |
| Credentials | secrets / environments |
| Shared Library | Reusable workflow / composite action |
| Parameters | workflow_dispatch inputs |

## Step 3: Translate a Real Pipeline

**Jenkins (Groovy):**
\`\`\`groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      steps { sh 'docker build -t myapp:$BUILD_NUMBER .' }
    }
    stage('Deploy to Dev') {
      when { branch 'develop' }
      steps { sh 'kubectl apply -f k8s/dev/' }
    }
  }
}
\`\`\`

**GitHub Actions equivalent:**
\`\`\`yaml
name: Build and Deploy
on:
  push:
    branches: [develop, main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.run_number }} .

  deploy-dev:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development
    steps:
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/dev/
\`\`\`

## Step 4: Self-Hosted Runners on Azure VMs

For private AKS clusters (no public API endpoint), you need self-hosted runners inside the VNet:

\`\`\`bash
# On your Azure VM inside the VNet
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.0/actions-runner-linux-x64-2.319.0.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/YOUR_ORG/YOUR_REPO --token YOUR_TOKEN --labels azure-vnet
./svc.sh install && ./svc.sh start
\`\`\`

Then reference in your workflow: \`runs-on: [self-hosted, azure-vnet]\`

## The Gotchas

1. **Secret scoping** — GitHub Actions secrets are per-repo or per-org. Jenkins credentials are global. Plan secret migration carefully.
2. **Concurrency** — Add \`concurrency:\` groups to prevent parallel deploys to the same environment.
3. **Artifact retention** — Actions artifacts default to 90 days. Set \`retention-days\` explicitly.
4. **Matrix builds** — GitHub Actions matrix is significantly more powerful than Jenkins parallel stages.

## Migration Timeline (Real Numbers)

For a team of 8 microservices with 20 Jenkins pipelines: ~3 weeks total, 2 engineers, zero downtime by running both in parallel during transition.
    `,
  },
  {
    id: 3,
    slug: 'elk-stack-kubernetes-production-setup',
    title: 'Deploying ELK Stack on Kubernetes: Production-Grade Log Management',
    excerpt: 'Step-by-step guide to deploying Elasticsearch, Logstash, Kibana, and Filebeat on Kubernetes with persistent storage, resource limits, and index lifecycle management for a microservice platform.',
    date: '2024-07-20',
    readTime: '12 min read',
    tags: ['Elasticsearch', 'Kibana', 'Kubernetes', 'Logging'],
    category: 'Monitoring',
    content: `
## Why ELK on Kubernetes?

Running ELK Stack on Kubernetes gives you the same benefits as your application workloads: auto-healing, resource management, and declarative configuration. At RL Technologies, I deployed this for a 10-service microservice platform and it transformed our debugging workflow.

## Architecture

\`\`\`
Microservice Pods → Filebeat DaemonSet → Logstash → Elasticsearch → Kibana
\`\`\`

Each component has a specific role:
- **Filebeat**: Lightweight log shipper running as a DaemonSet on every node
- **Logstash**: Parse, filter, and transform logs before indexing
- **Elasticsearch**: Indexed storage and full-text search
- **Kibana**: Visualization and dashboards

## Elasticsearch Deployment

The most critical part is resource allocation. Elasticsearch is memory-hungry:

\`\`\`yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  replicas: 3
  serviceName: elasticsearch
  template:
    spec:
      initContainers:
        - name: fix-permissions
          image: busybox
          command: ["sh", "-c", "chown -R 1000:1000 /usr/share/elasticsearch/data"]
          volumeMounts:
            - name: data
              mountPath: /usr/share/elasticsearch/data
        - name: increase-vm-max-map
          image: busybox
          command: ["sysctl", "-w", "vm.max_map_count=262144"]
          securityContext:
            privileged: true
      containers:
        - name: elasticsearch
          image: elasticsearch:8.11.0
          resources:
            requests:
              memory: "2Gi"
              cpu: "500m"
            limits:
              memory: "4Gi"
              cpu: "2"
          env:
            - name: ES_JAVA_OPTS
              value: "-Xms1g -Xmx1g"
            - name: discovery.type
              value: single-node  # Use zen discovery for 3-node cluster
\`\`\`

## Filebeat DaemonSet

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: filebeat
spec:
  template:
    spec:
      containers:
        - name: filebeat
          image: elastic/filebeat:8.11.0
          args: ["-c", "/etc/filebeat.yml", "-e"]
          volumeMounts:
            - name: config
              mountPath: /etc/filebeat.yml
              subPath: filebeat.yml
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
\`\`\`

## Index Lifecycle Management (ILM)

Without ILM, Elasticsearch disk fills up. Set up automatic rollover and deletion:

\`\`\`json
PUT _ilm/policy/app-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": { "max_size": "10gb", "max_age": "7d" }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": { "shrink": { "number_of_shards": 1 } }
      },
      "delete": {
        "min_age": "30d",
        "actions": { "delete": {} }
      }
    }
  }
}
\`\`\`

## Production Lessons

1. **Set JVM heap to 50% of container memory** — never more than 31GB (G1GC limit)
2. **Use dedicated master nodes** for clusters >3 nodes
3. **Persistent volumes** — use Azure Managed Disks (Premium SSD) for Elasticsearch data
4. **Network policy** — restrict Elasticsearch access to only Logstash and Kibana pods
5. **Index templates** — define mappings upfront, don't rely on dynamic mapping in production
    `,
  },
  {
    id: 4,
    slug: 'terraform-azure-aks-production',
    title: 'Terraform for Azure AKS: Production Infrastructure as Code',
    excerpt: 'Complete Terraform module for an Azure AKS cluster with VNet, subnets, Application Gateway, managed identities, Azure Monitor integration, and state backend — everything you need for a production-grade setup.',
    date: '2024-05-15',
    readTime: '11 min read',
    tags: ['Terraform', 'Azure', 'AKS', 'IaC'],
    category: 'Infrastructure',
    content: `
## Why Terraform for AKS?

Clicking through the Azure portal to create an AKS cluster works once. When you need to replicate it for dev, staging, and prod — or when a colleague needs to rebuild it — Terraform is the only sane approach.

At SELISE, I reduced new environment setup from 2 days to 45 minutes by writing a reusable Terraform module for our Azure AKS infrastructure.

## Project Structure

\`\`\`
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   └── variables.tf
│   ├── aks/
│   │   ├── main.tf
│   │   └── variables.tf
│   └── app_gateway/
│       ├── main.tf
│       └── variables.tf
└── environments/
    ├── dev.tfvars
    ├── staging.tfvars
    └── prod.tfvars
\`\`\`

## Remote State Backend (Non-Negotiable for Teams)

\`\`\`hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstateprodstorage"
    container_name       = "tfstate"
    key                  = "aks-prod.terraform.tfstate"
  }
}
\`\`\`

## Networking Module

\`\`\`hcl
resource "azurerm_virtual_network" "main" {
  name                = "\${var.prefix}-vnet"
  address_space       = [var.vnet_cidr]
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "aks" {
  name                 = "\${var.prefix}-aks-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.aks_subnet_cidr]
}

resource "azurerm_subnet" "appgw" {
  name                 = "\${var.prefix}-appgw-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.appgw_subnet_cidr]
}
\`\`\`

## AKS Cluster Module

\`\`\`hcl
resource "azurerm_kubernetes_cluster" "main" {
  name                = "\${var.prefix}-aks"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "\${var.prefix}-aks"
  kubernetes_version  = var.k8s_version

  default_node_pool {
    name                = "system"
    node_count          = var.system_node_count
    vm_size             = var.system_vm_size
    vnet_subnet_id      = var.aks_subnet_id
    enable_auto_scaling = true
    min_count           = 1
    max_count           = var.max_system_nodes
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
  }

  monitor_metrics {}

  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  }

  tags = var.tags
}
\`\`\`

## Deploy with GitHub Actions

\`\`\`yaml
- name: Terraform Apply
  env:
    ARM_CLIENT_ID: \${{ secrets.AZURE_CLIENT_ID }}
    ARM_CLIENT_SECRET: \${{ secrets.AZURE_CLIENT_SECRET }}
    ARM_SUBSCRIPTION_ID: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
    ARM_TENANT_ID: \${{ secrets.AZURE_TENANT_ID }}
  run: |
    cd terraform
    terraform init
    terraform plan -var-file="environments/\${{ github.event.inputs.environment }}.tfvars" -out=plan.tfplan
    terraform apply plan.tfplan
\`\`\`

## Key Lessons

1. **Always use remote state** — local state files in Git are a disaster waiting to happen
2. **Separate node pools** for system and user workloads — prevent resource starvation
3. **Enable auto-scaling** from day one — it's harder to add later
4. **Managed Identity over Service Principal** — no secret rotation headaches
5. **Tag everything** — cost management in Azure relies on consistent tagging
    `,
  },
  {
    id: 5,
    slug: 'prometheus-grafana-kubernetes-monitoring',
    title: 'Prometheus & Grafana Monitoring Stack for Kubernetes Microservices',
    excerpt: 'Setting up a production-grade observability stack with Prometheus Operator, custom recording rules, alerting with PagerDuty integration, and Grafana dashboards for microservice SLOs.',
    date: '2024-03-08',
    readTime: '9 min read',
    tags: ['Prometheus', 'Grafana', 'Monitoring', 'Kubernetes'],
    category: 'Monitoring',
    content: `
## The Observability Stack

For a microservice platform running in Canada, observability isn't optional. Here's the stack I standardized on:

- **Prometheus** — metrics collection and alerting rules
- **Grafana** — dashboards and visualization  
- **Alertmanager** — alert routing (PagerDuty / Slack)
- **Tempo** — distributed tracing
- **Loki** — log aggregation

## Install with kube-prometheus-stack (Helm)

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  --create-namespace \\
  --values values.yaml
\`\`\`

## Custom Recording Rules for Microservice SLOs

Instead of alerting on raw metrics, create recording rules to pre-compute SLO-relevant metrics:

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: slo-rules
  namespace: monitoring
spec:
  groups:
    - name: slo.rules
      interval: 30s
      rules:
        - record: job:http_request_duration_seconds:p99
          expr: |
            histogram_quantile(0.99,
              sum(rate(http_request_duration_seconds_bucket[5m])) by (job, le)
            )
        - record: job:http_requests_total:rate5m
          expr: sum(rate(http_requests_total[5m])) by (job, status_code)
        - record: job:error_rate:rate5m
          expr: |
            sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (job)
            /
            sum(rate(http_requests_total[5m])) by (job)
\`\`\`

## Alerting Rules

\`\`\`yaml
- alert: HighErrorRate
  expr: job:error_rate:rate5m > 0.01
  for: 5m
  labels:
    severity: critical
    team: devops
  annotations:
    summary: "High error rate on {{ $labels.job }}"
    description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.job }}"
    runbook_url: "https://wiki.company.com/runbooks/high-error-rate"

- alert: HighP99Latency
  expr: job:http_request_duration_seconds:p99 > 2
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "P99 latency above 2s on {{ $labels.job }}"
\`\`\`

## Grafana Dashboard as Code

Store dashboards as ConfigMaps so they're version-controlled and auto-provisioned:

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: microservice-dashboard
  namespace: monitoring
  labels:
    grafana_dashboard: "1"
data:
  microservices.json: |
    { "title": "Microservice Overview", ... }
\`\`\`

## The SLO Dashboard I Use

Every service gets these 4 panels:
1. **Request rate** (RPS over time)
2. **Error rate %** (target: <1%)
3. **P50 / P95 / P99 latency** (target P99: <500ms for APIs)
4. **Pod resource usage** (CPU/Memory vs limits)

This gives on-call engineers everything needed in 30 seconds.
    `,
  },
  {
    id: 6,
    slug: 'aws-to-azure-migration-guide',
    title: 'AWS to Azure Migration: A Practical Guide for DevOps Engineers',
    excerpt: 'Real-world patterns from migrating production microservices from AWS EKS to Azure AKS — covering networking, IAM equivalents, storage migration, and the CI/CD pipeline changes needed.',
    date: '2023-12-12',
    readTime: '13 min read',
    tags: ['Azure', 'AWS', 'Migration', 'Cloud'],
    category: 'Cloud',
    content: `
## Why Teams Migrate AWS → Azure

For enterprise companies in Canada (especially those using Microsoft 365, Entra ID, and Teams), Azure has a natural fit for identity integration and enterprise agreements. I led this migration at SELISE — here's the honest breakdown.

## Service Equivalency Map

| AWS | Azure | Notes |
|-----|-------|-------|
| EKS | AKS | AKS has tighter Azure AD integration |
| EC2 | Azure VM | Similar sizing, different naming |
| S3 | Azure Blob Storage | API incompatible, code changes needed |
| RDS | Azure SQL / Cosmos DB | Schema migration required |
| Route53 | Azure DNS | Zone file export/import |
| IAM | Entra ID + RBAC | Fundamentally different model |
| ECR | Azure Container Registry | Push/pull credential changes |
| CloudWatch | Azure Monitor + Log Analytics | Different query language (KQL vs CW Insights) |
| VPC | VNet | Subnetting model is similar |
| ALB | Application Gateway / Azure Load Balancer | AGW is WAF-capable |
| Certificate Manager | Key Vault | Cert storage + auto-renewal |

## Step 1: Assess Before You Migrate

\`\`\`bash
# Export your AWS architecture
aws ec2 describe-instances --output json > instances.json
aws eks list-clusters --output json > eks-clusters.json
aws s3api list-buckets --output json > s3-buckets.json
\`\`\`

Categorize each service: lift-and-shift, refactor, or replace.

## Step 2: Network Setup (VNet vs VPC)

AWS VPC and Azure VNet are conceptually similar but differ in routing:

\`\`\`hcl
# Azure VNet equivalent to AWS VPC
resource "azurerm_virtual_network" "main" {
  name          = "prod-vnet"
  address_space = ["10.0.0.0/8"]
  # AWS equivalent: aws_vpc with cidr_block
}

# Azure equivalent to AWS Security Groups = NSGs
resource "azurerm_network_security_group" "aks" {
  name = "aks-nsg"
  # Rules are inbound/outbound with priority (100-4096)
  # AWS SGs are stateful; Azure NSGs are also stateful
}
\`\`\`

## Step 3: Container Registry Migration

\`\`\`bash
# Pull from ECR
aws ecr get-login-password | docker login --username AWS \\
  --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest

# Push to ACR
az acr login --name mycompanyacr
docker tag 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest \\
  mycompanyacr.azurecr.io/myapp:latest
docker push mycompanyacr.azurecr.io/myapp:latest
\`\`\`

## Step 4: IAM → Azure RBAC

This is the hardest conceptual shift. AWS IAM uses JSON policies attached to users/roles. Azure uses RBAC with role assignments on resource scopes.

\`\`\`bash
# Grant AKS cluster access to pull from ACR (replaces ECR IAM policy)
az role assignment create \\
  --assignee \$(az aks show -n myaks -g myrg --query identityProfile.kubeletidentity.objectId -o tsv) \\
  --role AcrPull \\
  --scope \$(az acr show -n mycompanyacr --query id -o tsv)
\`\`\`

## Step 5: CI/CD Pipeline Changes

The biggest friction is updating all your pipelines. For GitHub Actions:

\`\`\`yaml
# Before (AWS)
- uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}

# After (Azure)  
- uses: azure/login@v2
  with:
    creds: \${{ secrets.AZURE_CREDENTIALS }}
\`\`\`

## Migration Strategy: Blue-Green Between Clouds

Don't do a hard cutover. Run both environments in parallel for 2–4 weeks:
1. Deploy to Azure, run in passive mode
2. Mirror traffic using Azure Traffic Manager (weighted routing)
3. Gradually shift traffic: 10% → 25% → 50% → 100%
4. Keep AWS running for 1 week after 100% Azure, then decommission

This is what I used at SELISE to achieve zero-downtime migration.
    `,
  },
];
