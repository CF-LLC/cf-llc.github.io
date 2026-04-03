'use client'

import { useEffect, useState } from 'react'
import { Code, ExternalLink, File, Github, Search } from 'lucide-react'
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
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Live builds and source code, side by side.</h2>
        <p className="mx-auto max-w-3xl text-base leading-7 text-sky-100/70 sm:text-lg">
          Filter by topic, preview live products instantly, and jump directly into source or deployed versions.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-100/45">{dataSource === 'repo' ? 'Curated project list' : 'Live list from GitHub'}</p>
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
            className="group card-sweep overflow-hidden rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 shadow-lg shadow-slate-950/20"
          >
            <div className={`relative min-h-[16.5rem] overflow-hidden p-5 ${project.homepage ? '' : `bg-gradient-to-br ${project.language && languageColors[project.language] ? languageColors[project.language] : 'from-[#7ed3ff] to-[#1262d8]'}`} `}>
              {project.homepage && (
                <>
                  <iframe
                    src={project.homepage}
                    title={`${project.name} live preview`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-[1.01] bg-slate-950 transition-transform duration-700 group-hover:scale-[1.06]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-950/30 to-slate-950/90" />
                </>
              )}
              {!project.homepage && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_28%)] opacity-70" />
              )}
              <div className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-slate-900 shadow">
                {project.language ? (
                  <Code className="h-5 w-5" />
                ) : (
                  <File className="h-5 w-5" />
                )}
              </div>
              <motion.div
                className="relative pr-10"
                initial={{ opacity: 0.92, y: 6 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <h3 className="mb-2 text-xl font-bold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">{project.name}</h3>
                <p className="mb-4 line-clamp-3 text-sm text-white/92 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                  {project.description || 'No description available.'}
                </p>
              </motion.div>

              {project.homepage && (
                <motion.a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="absolute bottom-4 left-4 z-10 inline-flex items-center rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-sky-900/35"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Open Live Site
                </motion.a>
              )}
            </div>
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {project.topics.slice(0, 3).map(topic => (
                  <span key={topic} className="rounded-full border border-sky-200/10 bg-sky-300/10 px-2 py-1 text-xs text-sky-100/84">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex justify-between gap-4 pt-4 text-sm">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-sky-200/20 bg-sky-50/5 px-3 py-1.5 text-sky-200 transition-colors hover:border-sky-100/45 hover:text-white"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Source
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 px-3 py-1.5 font-semibold text-slate-950 shadow-lg shadow-sky-900/30"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Site
                  </a>
                )}
                {!project.homepage && (
                  <span className="inline-flex items-center rounded-full border border-slate-400/20 bg-slate-200/10 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-300/80">
                    No live site yet
                  </span>
                )}
              </div>
              {project.homepage && (
                <p className="mt-3 text-xs text-sky-100/45">If preview is blocked by site security, open Live Site.</p>
              )}
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
