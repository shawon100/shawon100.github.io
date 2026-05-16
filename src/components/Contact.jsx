import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi'
import { SiStackoverflow } from 'react-icons/si'

const socials = [
  {
    label: 'LinkedIn',
    handle: '/in/ashadullah-shawon-b51606aa',
    href: 'https://www.linkedin.com/in/ashadullah-shawon-b51606aa',
    icon: <FiLinkedin size={22} />,
    color: '#0ea5e9',
    desc: 'Connect professionally',
  },
  {
    label: 'GitHub',
    handle: 'github.com/shawon100',
    href: 'https://github.com/shawon100',
    icon: <FiGithub size={22} />,
    color: '#94a3b8',
    desc: 'View my code',
  },
  {
    label: 'Email',
    handle: 'shawonashadullah@gmail.com',
    href: 'mailto:shawonashadullah@gmail.com',
    icon: <FiMail size={22} />,
    color: '#00d4aa',
    desc: 'Send me a message',
  },
  {
    label: 'Stack Overflow',
    handle: 'stackoverflow.com/users/3859220',
    href: 'https://stackoverflow.com/users/3859220/shawon',
    icon: <SiStackoverflow size={22} />,
    color: '#f59e0b',
    desc: 'Q&A contributions',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="py-24 bg-[#0d1424]">
      <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">07. Get In Touch</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-6">
            Open to Opportunities
            <span className="block text-gradient mt-1">in Canada & Remote</span>
          </h2>
          <p className="text-[#94a3b8] max-w-xl mx-auto text-base leading-relaxed mb-12">
            I'm currently open to Senior DevOps / Platform Engineer roles in Canada (Toronto / Ontario preferred) or
            fully remote positions. Whether you have an opportunity, a project, or just want to talk DevOps —
            I'd love to hear from you.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <a
            href="mailto:shawonashadullah@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#00d4aa] text-[#0a0f1e] font-bold rounded-xl hover:bg-[#00b894] transition-all duration-200 shadow-lg shadow-[#00d4aa]/20 text-base"
          >
            <FiMail size={20} />
            Say Hello
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="group bg-[#0e1829] border border-[#ffffff10] rounded-xl p-4 text-center hover:border-[#00d4aa]/35 transition-all duration-300 teal-glow shadow-sm shadow-black/20"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 mx-auto transition-colors"
                style={{ backgroundColor: `${s.color}15`, color: s.color }}
              >
                {s.icon}
              </div>
              <p className="font-semibold text-[#f1f5f9] text-sm mb-1 group-hover:text-[#00d4aa] transition-colors">
                {s.label}
              </p>
              <p className="text-xs text-[#64748b]">{s.desc}</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
