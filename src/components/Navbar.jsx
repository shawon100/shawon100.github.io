import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: 'about', label: 'About' },
  { to: 'experience', label: 'Experience' },
  { to: 'skills', label: 'Skills' },
  { to: 'projects', label: 'Projects' },
  { to: 'blog', label: 'Blog' },
  { to: 'education', label: 'Education' },
  { to: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0f1e]/95 backdrop-blur-md border-b border-[#ffffff08] shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="hero"
          smooth
          duration={500}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <span className="font-mono text-[#00d4aa] text-lg font-semibold group-hover:text-white transition-colors">
            &lt;
          </span>
          <span className="font-semibold text-[#f1f5f9] tracking-wide group-hover:text-[#00d4aa] transition-colors">
            Shawon
          </span>
          <span className="font-mono text-[#00d4aa] text-lg font-semibold group-hover:text-white transition-colors">
            /&gt;
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={500}
              offset={-70}
              spy
              activeClass="text-[#00d4aa]"
              className="px-4 py-2 text-sm text-[#94a3b8] hover:text-[#00d4aa] transition-colors cursor-pointer rounded-md hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/in/ashadullah-shawon-b51606aa"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-2 text-sm font-medium border border-[#00d4aa] text-[#00d4aa] rounded-md hover:bg-[#00d4aa] hover:text-[#0a0f1e] transition-all duration-200"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#94a3b8] hover:text-[#00d4aa] transition-colors p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d1424] border-b border-[#ffffff08]"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  smooth
                  duration={500}
                  offset={-70}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-3 text-[#94a3b8] hover:text-[#00d4aa] transition-colors cursor-pointer rounded-md hover:bg-white/5 text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.linkedin.com/in/ashadullah-shawon-b51606aa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-3 text-center text-sm font-medium border border-[#00d4aa] text-[#00d4aa] rounded-md hover:bg-[#00d4aa] hover:text-[#0a0f1e] transition-all"
              >
                Hire Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
