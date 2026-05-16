import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiExternalLink, FiMapPin, FiCalendar } from 'react-icons/fi'
import { experience } from '../data/experience'

export default function Experience() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="py-24 bg-[#0a0f1e]">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">02. Work History</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            Professional Experience
          </h2>
        </motion.div>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-[#ffffff08]" />

          <div className="space-y-10">
            {experience.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="relative pl-12 md:pl-20"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[11px] md:left-[27px] top-5 w-3 h-3 rounded-full border-2 border-[#0a0f1e]"
                  style={{ backgroundColor: job.color }}
                />

                <div className="bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 hover:border-[#00d4aa]/25 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 teal-glow">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#f1f5f9] mb-1">{job.role}</h3>
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium hover:text-[#00d4aa] transition-colors"
                        style={{ color: job.color }}
                      >
                        {job.company}
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex flex-col gap-1 sm:text-right text-sm text-[#64748b]">
                      <span className="flex items-center gap-1 sm:justify-end">
                        <FiCalendar size={12} />
                        {job.period}
                      </span>
                      <span className="flex items-center gap-1 sm:justify-end">
                        <FiMapPin size={12} />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-4">
                    {job.highlights.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#94a3b8] leading-relaxed">
                        <span className="text-[#00d4aa] mt-0.5 flex-shrink-0">▹</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#0a0f1e] text-[#64748b] border border-[#ffffff06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
