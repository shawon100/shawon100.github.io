import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiAward } from 'react-icons/fi'

const education = [
  {
    degree: 'Master of Applied Science',
    field: 'Computer Engineering',
    school: 'Ontario Tech University',
    location: 'Ontario, Canada',
    period: '2021 – 2023',
    color: '#00d4aa',
    highlights: [
      'Research focus on AI/ML and system design',
      'Machine Learning, Deep Learning, NLP, Image Processing',
      'MLOps and LLM research (GPT-4, LLaMA2)',
    ],
  },
  {
    degree: 'Bachelor of Science & Engineering',
    field: 'Computer Science & Engineering (CSE)',
    school: 'Rajshahi University of Engineering & Technology (RUET)',
    location: 'Rajshahi, Bangladesh',
    period: '2013 – 2018',
    color: '#0ea5e9',
    highlights: [
      'Core CS fundamentals: Algorithms, OS, Networks, Databases',
      'Software Engineering and Design Patterns',
      'Final year project: Image processing & defect detection',
    ],
  },
]

export default function Education() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="education" className="py-24 bg-[#0a0f1e]">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">06. Education</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            Academic Background
          </h2>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 hover:border-[#00d4aa]/30 transition-all duration-300 teal-glow shadow-sm shadow-black/20"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                style={{ backgroundColor: `${edu.color}15` }}
              >
                <FiAward size={20} style={{ color: edu.color }} />
              </div>

              <h3 className="font-bold text-[#f1f5f9] text-base mb-1">{edu.degree}</h3>
              <p style={{ color: edu.color }} className="text-sm font-medium mb-2">{edu.field}</p>
              <p className="text-[#94a3b8] text-sm mb-1">{edu.school}</p>
              <p className="text-[#64748b] text-xs mb-4">
                {edu.location} · {edu.period}
              </p>

              <ul className="space-y-2">
                {edu.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#00d4aa] mt-0.5 shrink-0">▹</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
