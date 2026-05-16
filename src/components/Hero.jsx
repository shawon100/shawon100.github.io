import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'

const titles = [
  '7+ Years Automating Deployments via CI/CD',
  'Senior DevOps Engineer',
  'Kubernetes & Cloud Infrastructure Expert',
  'CI/CD Automation Specialist',
  'Infrastructure as Code Architect',
]

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = titles[titleIndex]
    let timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setTitleIndex((i) => (i + 1) % titles.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, titleIndex])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0ea5e9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 lg:py-0 lg:min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:flex-1 text-center lg:text-left"
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-4 tracking-widest uppercase">
            Open to remote/hybrid/onsite roles in Canada or worldwide!
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#f1f5f9] leading-tight mb-4">
            Ashadullah{' '}
            <span className="text-gradient">Shawon</span>
          </h1>

          <div className="h-12 mb-6 flex items-center justify-center lg:justify-start">
            <span className="text-xl sm:text-2xl font-semibold text-[#94a3b8]">
              {displayed}
              <span className="animate-pulse text-[#00d4aa]">|</span>
            </span>
          </div>

          <p className="text-[#94a3b8] text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            7+ years building and automating mission-critical cloud infrastructure, deployments, and CI/CD platforms
            across <span className="text-[#f1f5f9] font-medium">Azure</span>,{' '}
            <span className="text-[#f1f5f9] font-medium">AWS</span>,{' '}
            <span className="text-[#f1f5f9] font-medium">GCP</span>, and{' '}
            <span className="text-[#f1f5f9] font-medium">Kubernetes</span> —
            based in <span className="text-[#00d4aa] font-medium">Toronto, Ontario, Canada</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
            <Link
              to="experience"
              smooth
              duration={600}
              offset={-70}
              className="cursor-pointer px-6 py-3 bg-[#00d4aa] text-[#0a0f1e] font-semibold rounded-lg hover:bg-[#00b894] transition-all duration-200 shadow-lg shadow-[#00d4aa]/20"
            >
              View Experience
            </Link>
            <a
              href="https://www.linkedin.com/in/ashadullah-shawon-b51606aa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#1e293b] text-[#f1f5f9] font-medium rounded-lg hover:border-[#00d4aa] hover:text-[#00d4aa] transition-all duration-200"
            >
              Connect on LinkedIn
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-5 justify-center lg:justify-start">
            {[
              { href: 'https://github.com/shawon100', icon: <FiGithub size={20} />, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/ashadullah-shawon-b51606aa', icon: <FiLinkedin size={20} />, label: 'LinkedIn' },
              { href: 'mailto:shawonashadullah@gmail.com', icon: <FiMail size={20} />, label: 'Email' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[#64748b] hover:text-[#00d4aa] transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-shrink-0"
        >
          <div className="relative inline-block">
            {/* Teal ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] opacity-30 blur-sm" />
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9]" />
            <img
              src="/shawon.jpeg"
              alt="Ashadullah Shawon - Senior DevOps Engineer in Ontario Canada"
              className="relative w-52 h-52 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-[#0a0f1e]"
              loading="eager"
              fetchPriority="high"
            />
            {/* Floating badge — anchored to bottom-right of photo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-3 -right-3 bg-[#111827] border border-[#00d4aa]/40 rounded-xl px-3 py-2 shadow-xl shadow-black/40"
            >
              <p className="text-xs text-[#00d4aa] font-mono font-semibold">7+ Years</p>
              <p className="text-xs text-[#94a3b8]">DevOps Expert</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link to="about" smooth duration={500} offset={-70} className="cursor-pointer flex flex-col items-center gap-2 text-[#64748b] hover:text-[#00d4aa] transition-colors">
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiArrowDown size={16} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
