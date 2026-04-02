'use client'

import { useEffect, useState } from 'react'
import { Code, ExternalLink, Eye, File, Github, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
}

interface ApiProject {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
}

const PROJECTS_FILE_PATH = '/projects.json'
const GITHUB_PROJECTS_EDIT_URL = 'https://github.com/CF-LLC/cf-llc.github.io/edit/main/public/projects.json'

const languageColors: { [key: string]: string } = {
  JavaScript: 'from-[#73d4ff] to-[#2680ff]',
  TypeScript: 'from-[#8ee6ff] to-[#2b7fff]',
  Python: 'from-[#59c1ff] to-[#1555dd]',
  Java: 'from-[#5fa2ff] to-[#234ac9]',
  'C#': 'from-[#6bc3ff] to-[#1d74f8]',
  Ruby: 'from-[#85d5ff] to-[#0e63d6]',
}

const sanitizeProjects = (items: Project[]): Project[] => {
  return items
    .map(project => ({
      ...project,
      name: project.name.trim(),
      description: project.description?.trim() || null,
      html_url: project.html_url.trim(),
      homepage: project.homepage?.trim() || null,
      language: project.language?.trim() || null,
      topics: project.topics.map(topic => topic.trim()).filter(Boolean)
    }))
    .filter(project => project.name && project.html_url)
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [dataSource, setDataSource] = useState<'repo' | 'github'>('github')
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null)

  const applyProjectData = (nextProjects: Project[]) => {
    const cleaned = sanitizeProjects(nextProjects)
    setProjects(cleaned)
    setFilteredProjects(cleaned)
    const allCategories = ['All', ...Array.from(new Set(cleaned.flatMap(project => project.topics)))]
    setCategories(allCategories)
    setSelectedCategory('All')
  }

  const loadFromGithub = () => {
    fetch('https://api.github.com/users/cf-llc/repos')
      .then(response => response.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          const projectsWithTopics = data.map((project: unknown) => {
            const typedProject = project as ApiProject
            return {
              id: typedProject.id.toString(),
              name: typedProject.name,
              description: typedProject.description,
              html_url: typedProject.html_url,
              homepage: typedProject.homepage,
              language: typedProject.language,
              topics: Array.isArray(typedProject.topics) ? typedProject.topics : []
            }
          })
          applyProjectData(projectsWithTopics)
          setDataSource('github')
        }
      })
      .catch(error => console.error('Error fetching projects:', error))
  }

  useEffect(() => {
    fetch(PROJECTS_FILE_PATH, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Project file not available')
        }
        return response.json() as Promise<unknown>
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const typed = data as Project[]
          applyProjectData(typed)
          setDataSource('repo')
        } else {
          loadFromGithub()
        }
      })
      .catch(() => {
        loadFromGithub()
      })
  }, [])

  useEffect(() => {
    const filtered = projects.filter(project =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All' || project.topics.includes(selectedCategory))
    )
    setFilteredProjects(filtered)
  }, [searchTerm, selectedCategory, projects])

  return (
    <section className="section-card overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-200/60">Selected work</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Explore projects with a little more drama and a lot more clarity.</h2>
        <p className="mx-auto max-w-3xl text-base leading-7 text-sky-100/70 sm:text-lg">
          Filter by topic, scan faster, and get stronger contrast between information layers. The cards now feel closer to a product showcase than a default repo list.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={GITHUB_PROJECTS_EDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-300/10 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-300/15"
          >
            <ExternalLink className="h-4 w-4" />
            Owner: edit project file
          </a>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-100/45">
          {dataSource === 'repo' ? 'Using repo project file' : 'Using live GitHub repos'}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-full border border-sky-200/12 bg-slate-950/25 py-3 pl-10 pr-4 text-white placeholder:text-sky-100/35 focus:outline-none focus:ring-2 focus:ring-sky-300/20 sm:min-w-[260px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-100/40" size={20} />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <motion.button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-900/20'
                  : 'bg-slate-100/10 text-sky-100/78 hover:bg-slate-100/15'
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        layout
      >
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="group overflow-hidden rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 shadow-lg shadow-slate-950/20"
          >
            <div className={`relative bg-gradient-to-br p-5 ${project.language && languageColors[project.language] ? languageColors[project.language] : 'from-[#7ed3ff] to-[#1262d8]'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_28%)] opacity-70" />
              <div className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-slate-900 shadow">
                {project.language ? (
                  <Code className="h-5 w-5" />
                ) : (
                  <File className="h-5 w-5" />
                )}
              </div>
              <div className="relative pr-10">
                <h3 className="mb-2 text-xl font-bold text-white">{project.name}</h3>
                <p className="mb-4 line-clamp-3 text-sm text-white/88">
                  {project.description || 'No description available.'}
                </p>
              </div>
            </div>
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {project.topics.slice(0, 3).map(topic => (
                  <span key={topic} className="rounded-full border border-sky-200/10 bg-sky-300/10 px-2 py-1 text-xs text-sky-100/84">
                    {topic}
                  </span>
                ))}
              </div>

              {project.homepage && (
                <div className="mb-4">
                  <button
                    onClick={() => setActivePreviewId(current => current === project.id ? null : project.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-100 hover:bg-sky-300/15"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {activePreviewId === project.id ? 'Hide Preview' : 'Show Live Preview'}
                  </button>

                  {activePreviewId === project.id && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-sky-200/15 bg-slate-950/35">
                      <div className="border-b border-sky-200/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-sky-100/65">
                        Embedded preview
                      </div>
                      <iframe
                        src={project.homepage}
                        title={`${project.name} live preview`}
                        loading="lazy"
                        className="h-56 w-full bg-slate-950"
                        referrerPolicy="no-referrer"
                      />
                      <p className="px-3 py-2 text-xs text-sky-100/55">
                        If this site blocks embedding, use Live Demo to open it in a new tab.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto flex justify-between gap-4 pt-4 text-sm">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sky-200 transition-colors hover:text-white"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sky-200 transition-colors hover:text-white"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="mt-6 rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 px-5 py-8 text-center text-sky-100/70">
          No projects matched that search yet. Try clearing the term or choosing another topic.
        </div>
      )}
    </section>
  )
}
