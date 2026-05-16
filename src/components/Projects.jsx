import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

const projects = [
  {
    title: 'Multi-Tenant AKS Platform',
    description:
      'Designed and deployed a production-grade multi-tenant Azure AKS platform for 15+ microservices. Includes namespace isolation, RBAC policies, Ingress via Application Gateway, and auto-scaling node pools.',
    tags: ['AKS', 'Azure', 'Kubernetes', 'Terraform', 'Helm', 'RBAC'],
    color: '#00d4aa',
    featured: true,
  },
  {
    title: 'ELK Stack on Kubernetes',
    description:
      'Deployed full ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat) in Kubernetes with persistent storage, ILM policies, and pre-built dashboards for microservice log aggregation.',
    tags: ['Elasticsearch', 'Kibana', 'Filebeat', 'Kubernetes', 'StatefulSet'],
    color: '#0ea5e9',
    featured: true,
  },
  {
    title: 'GitHub Actions Migration Framework',
    description:
      'Led migration of 20+ Jenkins pipelines to GitHub Actions across 8 microservices. Built reusable workflow templates, self-hosted runner setup on Azure VMs, and secret management patterns.',
    tags: ['GitHub Actions', 'Jenkins', 'CI/CD', 'Azure VMs', 'Migration'],
    color: '#a78bfa',
    featured: true,
  },
  {
    title: 'Autoscaled Azure Pipelines & GitHub Actions Private Agents',
    description:
      'Designed and built autoscaled Azure Pipelines and GitHub Actions private agent pools from scratch. Agents run on Azure VMSS, scale to zero when idle, and spin up on demand — cutting CI costs by 40% vs fixed hosted runners.',
    tags: ['Azure Pipelines', 'GitHub Actions', 'VMSS', 'Self-hosted Runners', 'Autoscaling'],
    color: '#f59e0b',
    featured: false,
  },
  {
    title: 'High-Available Scalable Kubernetes Services',
    description:
      'Architected highly available, auto-scaling Kubernetes platform with Traefik and Istio service mesh as ingress/gateway layer. All backend and frontend services managed via HPA scalers with custom metrics for zero-downtime scaling under traffic spikes.',
    tags: ['Kubernetes', 'Traefik', 'Istio', 'HPA', 'Service Mesh', 'AKS'],
    color: '#f472b6',
    featured: false,
  },
  {
    title: 'Terraform Azure Infrastructure Modules',
    description:
      'Reusable Terraform modules for Azure: VNet, AKS clusters, Application Gateway, ACR, Key Vault, Log Analytics. Reduced new environment provisioning from 2 days to 45 minutes.',
    tags: ['Terraform', 'Azure', 'IaC', 'AKS', 'App Gateway', 'VNet'],
    color: '#34d399',
    featured: false,
  },
]

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="py-24 bg-[#0a0f1e]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">04. Portfolio</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            Featured Projects
          </h2>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 flex flex-col hover:border-[#00d4aa]/30 transition-all duration-300 teal-glow shadow-sm shadow-black/20"
            >
              {project.featured && (
                <span
                  className="self-start text-xs font-mono px-2 py-0.5 rounded-full mb-4 border"
                  style={{ color: project.color, borderColor: `${project.color}40`, backgroundColor: `${project.color}10` }}
                >
                  Featured
                </span>
              )}

              <h3 className="font-bold text-[#f1f5f9] text-base mb-3 group-hover:text-[#00d4aa] transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-[#94a3b8] leading-relaxed flex-1 mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-[#0a0f1e] text-[#94a3b8] border border-[#ffffff06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
