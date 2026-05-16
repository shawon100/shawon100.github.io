import { FiGithub, FiLinkedin, FiHeart } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1e] border-t border-[#ffffff08] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#64748b] text-center sm:text-left">
          © {new Date().getFullYear()} Ashadullah Shawon · Senior DevOps Engineer, Ontario Canada
        </p>

        <div className="flex items-center gap-1 text-sm text-[#64748b]">
          <span>Built with</span>
          <FiHeart size={12} className="text-[#00d4aa] mx-1" />
          <span>React · Tailwind · Framer Motion</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/shawon100"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#64748b] hover:text-[#00d4aa] transition-colors"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/ashadullah-shawon-b51606aa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#64748b] hover:text-[#00d4aa] transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
