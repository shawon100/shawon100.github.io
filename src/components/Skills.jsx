import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiServer, FiCloud, FiGitBranch, FiCode, FiActivity, FiShield,
} from 'react-icons/fi'
import { skillCategories } from '../data/skills'

const iconMap = {
  server: <FiServer size={20} />,
  cloud: <FiCloud size={20} />,
  pipeline: <FiGitBranch size={20} />,
  code: <FiCode size={20} />,
  monitor: <FiActivity size={20} />,
  shield: <FiShield size={20} />,
}

const colors = ['#00d4aa', '#0ea5e9', '#a78bfa', '#f59e0b', '#f472b6', '#34d399']

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-24 bg-[#0d1424]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">03. Technical Skills</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            Skills & Technologies
          </h2>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, i) => {
            const color = colors[i % colors.length]
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 hover:border-[#00d4aa]/25 transition-all duration-300 teal-glow shadow-sm shadow-black/20"
                style={{ '--hover-border': color }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {iconMap[cat.icon]}
                  </div>
                  <h3 className="font-semibold text-[#f1f5f9] text-sm">{cat.title}</h3>
                </div>

                {/* Skills with progress bars */}
                <div className="space-y-3">
                  {cat.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-[#94a3b8]">{skill.name}</span>
                        <span className="text-xs font-mono" style={{ color }}>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-[#0a0f1e] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
