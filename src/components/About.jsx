import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward, FiCloud, FiZap, FiGlobe } from 'react-icons/fi'

const stats = [
  { icon: <FiAward size={22} />, value: '7+', label: 'Years Experience', color: '#00d4aa' },
  { icon: <FiCloud size={22} />, value: '3', label: 'Cloud Platforms', color: '#0ea5e9' },
  { icon: <FiZap size={22} />, value: '50%', label: 'Faster Deployments', color: '#a78bfa' },
  { icon: <FiGlobe size={22} />, value: '15+', label: 'Microservices Managed', color: '#f59e0b' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 bg-[#0d1424]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">01. About Me</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            DevOps Engineer Based in Canada
          </h2>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            <p className="text-[#94a3b8] leading-relaxed text-base">
              I'm a <strong className="text-[#f1f5f9]">Senior DevOps Engineer based in Toronto, Ontario, Canada</strong> with
              over 7 years of experience deploying, automating, and securing mission-critical cloud infrastructure
              at scale. I specialize in bridging development and operations — making software delivery fast,
              reliable, and repeatable.
            </p>
            <p className="text-[#94a3b8] leading-relaxed text-base">
              My expertise spans the full DevOps lifecycle: from designing{' '}
              <strong className="text-[#f1f5f9]">multi-tenant Kubernetes clusters</strong> on Azure AKS and AWS EKS,
              to building zero-touch CI/CD pipelines with GitHub Actions and Azure Pipelines, to setting up
              production-grade observability with Prometheus, Grafana, and the ELK Stack.
            </p>
            <p className="text-[#94a3b8] leading-relaxed text-base">
              I've led successful <strong className="text-[#f1f5f9]">cloud migrations</strong> (AWS → Azure,
              On-Prem → Cloud) and helped engineering teams across Canada and globally reduce deployment
              time by 50% and infrastructure costs by 30%. I hold an MSc in Computer Engineering from
              Ontario Tech University.
            </p>

            {/* Key strengths */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                'Multi-cloud Architecture',
                'Kubernetes & AKS / EKS',
                'CI/CD Pipeline Design',
                'Infrastructure as Code',
                'Cloud Cost Optimization',
                'Team Mentorship & Leadership',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <span className="text-[#00d4aa]">▹</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 hover:border-[#00d4aa]/30 transition-all duration-300 teal-glow shadow-sm shadow-black/30"
              >
                <div style={{ color: stat.color }} className="mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-sm text-[#64748b]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
