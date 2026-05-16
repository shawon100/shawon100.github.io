import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiClock, FiTag, FiX, FiArrowLeft } from 'react-icons/fi'
import { blogPosts } from '../data/blog'

const categories = ['All', 'Kubernetes', 'CI/CD', 'Monitoring', 'Infrastructure', 'Cloud']

function BlogCard({ post, onClick, inView, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      onClick={() => onClick(post)}
      className="group bg-[#0e1829] border border-[#ffffff10] rounded-xl p-6 cursor-pointer hover:border-[#00d4aa]/35 transition-all duration-300 teal-glow flex flex-col shadow-sm shadow-black/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#64748b]">
          <FiClock size={11} />
          {post.readTime}
        </span>
      </div>

      <h3 className="font-bold text-[#f1f5f9] text-base mb-3 leading-snug group-hover:text-[#00d4aa] transition-colors">
        {post.title}
      </h3>

      <p className="text-sm text-[#94a3b8] leading-relaxed flex-1 mb-4">{post.excerpt}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs font-mono rounded bg-[#0a0f1e] text-[#64748b] border border-[#ffffff08]">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-[#64748b] ml-2 shrink-0">
          {new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </motion.article>
  )
}

function BlogModal({ post, onClose }) {
  if (!post) return null

  // Parse simple markdown-like content
  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-[#f1f5f9] mt-8 mb-3">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-semibold text-[#00d4aa] mt-6 mb-2">{line.slice(4)}</h3>)
      } else if (line.startsWith('```')) {
        const lang = line.slice(3)
        const codeLines = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <pre key={i} className="bg-[#060d1a] border border-[#ffffff08] rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono text-[#a0b0c8] leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
      } else if (line.startsWith('| ')) {
        // Table
        const tableLines = []
        while (i < lines.length && lines[i].startsWith('|')) {
          tableLines.push(lines[i])
          i++
        }
        const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
        const rows = tableLines.slice(2).map(row => row.split('|').filter(Boolean).map(c => c.trim()))
        elements.push(
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {headers.map((h, hi) => (
                    <th key={hi} className="text-left px-3 py-2 text-[#00d4aa] font-mono border border-[#ffffff08] bg-[#060d1a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-[#94a3b8] border border-[#ffffff08]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      } else if (line.startsWith('- ') || line.startsWith('1. ')) {
        const listLines = []
        while (i < lines.length && (lines[i].startsWith('- ') || /^\d+\. /.test(lines[i]))) {
          listLines.push(lines[i].replace(/^-\s|^\d+\.\s/, ''))
          i++
        }
        elements.push(
          <ul key={i} className="space-y-2 my-3 pl-2">
            {listLines.map((item, li) => (
              <li key={li} className="flex gap-2 text-sm text-[#94a3b8]">
                <span className="text-[#00d4aa] mt-0.5">▹</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f1f5f9]">$1</strong>').replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-[#0a0f1e] px-1 rounded text-[#00d4aa]">$1</code>') }} />
              </li>
            ))}
          </ul>
        )
        continue
      } else if (line.startsWith('---')) {
        elements.push(<hr key={i} className="border-[#ffffff08] my-6" />)
      } else if (line.trim()) {
        elements.push(
          <p key={i} className="text-sm text-[#94a3b8] leading-relaxed my-2"
            dangerouslySetInnerHTML={{
              __html: line
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f1f5f9]">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-[#0a0f1e] px-1 rounded text-[#00d4aa]">$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#00d4aa] underline">$1</a>')
            }}
          />
        )
      }
      i++
    }
    return elements
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0e1829] border border-[#ffffff10] rounded-2xl max-w-3xl w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#64748b] hover:text-[#f1f5f9] transition-colors p-1"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#64748b]">
              <FiClock size={11} />
              {post.readTime}
            </span>
            <span className="text-xs text-[#64748b]">
              {new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6 leading-snug">{post.title}</h2>

          <div>{renderContent(post.content)}</div>

          <div className="mt-8 pt-6 border-t border-[#ffffff08] flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#0a0f1e] text-[#64748b] border border-[#ffffff08]">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Blog() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory)

  return (
    <section id="blog" className="py-24 bg-[#0d1424]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[#00d4aa] text-sm mb-3 tracking-widest uppercase">05. Knowledge Base</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f5f9] mb-3 section-heading">
            DevOps Blog
          </h2>
          <p className="text-[#94a3b8] mt-6 max-w-xl">
            Technical deep-dives on Kubernetes, CI/CD, cloud infrastructure, and DevOps patterns from production experience in Canada and globally.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? 'border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]'
                  : 'border-[#ffffff08] text-[#64748b] hover:border-[#00d4aa]/40 hover:text-[#94a3b8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post, i) => (
            <BlogCard key={post.id} post={post} onClick={setSelectedPost} inView={inView} index={i} />
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </section>
  )
}
