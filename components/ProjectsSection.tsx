'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, Code, ExternalLink, File, Github, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

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
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const applyProjectData = (nextProjects: Project[]) => {
    const cleaned = sanitizeProjects(nextProjects)
    setProjects(cleaned)
    setFilteredProjects(cleaned)
    const allCategories = ['All', ...Array.from(new Set(cleaned.flatMap(project => project.topics)))]
    setCategories(allCategories)
    setSelectedCategory('All')
  }

  const loadFromGithub = useCallback(() => {
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
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching projects:', error)
        setIsLoading(false)
      })
  }, [])

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
          setIsLoading(false)
        } else {
          loadFromGithub()
        }
      })
      .catch(() => {
        loadFromGithub()
      })
  }, [loadFromGithub])

  useEffect(() => {
    const filtered = projects.filter(project =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All' || project.topics.includes(selectedCategory))
    )
    setFilteredProjects(filtered)
  }, [searchTerm, selectedCategory, projects])

  useEffect(() => {
    const openProjects = () => setIsExpanded(true)
    const openProjectsFromHash = () => {
      if (window.location.hash === '#projects') {
        openProjects()
      }
    }

    openProjectsFromHash()

    window.addEventListener('open-projects', openProjects)
    window.addEventListener('hashchange', openProjectsFromHash)

    return () => {
      window.removeEventListener('open-projects', openProjects)
      window.removeEventListener('hashchange', openProjectsFromHash)
    }
  }, [])

  return (
    <section className="section-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <button
        type="button"
        onClick={() => setIsExpanded(current => !current)}
        className="group mb-2 flex w-full items-center justify-between gap-6 rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 px-5 py-5 text-left transition-colors hover:border-sky-200/20 hover:bg-sky-50/10"
        aria-expanded={isExpanded}
        aria-controls="projects-panel"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200/60">Selected work</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Live builds and source code, side by side.</h2>
          <p className="max-w-3xl text-base leading-7 text-sky-100/70 sm:text-lg">
            {isExpanded
              ? 'Filter by topic, preview live products instantly, and jump directly into source or deployed versions.'
              : 'Project previews stay tucked away on first load. Expand this panel when you want to browse the work.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-sky-100/45">
            <span>{dataSource === 'repo' ? 'Curated project list' : 'Live list from GitHub'}</span>
            {!isLoading && <span>{projects.length} projects loaded</span>}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-900/25"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="projects-panel"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mb-6 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-4">
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
                    className={`rounded-full px-3 py-1 text-sm ${
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

            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animated-gradient min-h-[29rem] rounded-[1.5rem] border border-white/12 bg-[linear-gradient(135deg,rgba(76,161,255,0.16),rgba(8,24,47,0.75),rgba(74,174,255,0.12))] shadow-[0_26px_70px_rgba(0,0,0,0.32)]"
                  />
                ))}
              </div>
            )}

            {!isLoading && (
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                layout
              >
                {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            layout
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -10, scale: 1.015, rotateX: 2 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="group card-sweep relative min-h-[29rem] overflow-hidden rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 shadow-[0_26px_70px_rgba(0,0,0,0.32)]"
          >
            <div className={`absolute inset-0 ${project.homepage ? '' : `bg-gradient-to-br ${project.language && languageColors[project.language] ? languageColors[project.language] : 'from-[#7ed3ff] to-[#1262d8]'}`} `}>
              {project.homepage && (
                <>
                  <iframe
                    src={project.homepage}
                    title={`${project.name} live preview`}
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] bg-slate-950 transition-transform duration-700 group-hover:scale-[1.045]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,20,0.16),rgba(3,10,20,0.36)_34%,rgba(3,10,20,0.78)_72%,rgba(3,10,20,0.93)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(130,214,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(75,132,255,0.14),transparent_22%)]" />
                </>
              )}
              {!project.homepage && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_28%)] opacity-70" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(255,255,255,0.03))] opacity-70" />
            </div>

            <div className="absolute right-4 top-4 z-20 rounded-full bg-white/88 p-2 text-slate-900 shadow-lg shadow-slate-950/25 backdrop-blur">
              {project.language ? (
                <Code className="h-5 w-5" />
              ) : (
                <File className="h-5 w-5" />
              )}
            </div>

            <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 pointer-events-none">
              <motion.div
                className="max-w-[86%] rounded-[1.35rem] border border-white/14 bg-slate-950/42 p-4 backdrop-blur-md"
                initial={false}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <h3 className="mb-2 text-xl font-bold text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">{project.name}</h3>
                <p className="line-clamp-4 text-sm leading-6 text-white/92 [text-shadow:0_2px_12px_rgba(0,0,0,0.78)]">
                  {project.description || 'No description available.'}
                </p>
              </motion.div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.topics.slice(0, 3).map(topic => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/14 bg-slate-950/45 px-2.5 py-1 text-xs font-medium text-white/92 backdrop-blur-md [text-shadow:0_1px_8px_rgba(0,0,0,0.68)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-white/16 bg-slate-950/42 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/32 hover:bg-slate-950/55"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Source
                  </a>

                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="animated-gradient inline-flex items-center rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Site
                    </a>
                  )}

                  {!project.homepage && (
                    <span className="inline-flex items-center rounded-full border border-white/16 bg-slate-950/42 px-3.5 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/78 backdrop-blur-md">
                      No live site yet
                    </span>
                  )}
                </div>

                {project.homepage && (
                  <p className="max-w-[18rem] text-xs text-white/72 [text-shadow:0_1px_10px_rgba(0,0,0,0.75)]">
                    Live preview shown on card. Use Live Site to open the full experience.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
                ))}
              </motion.div>
            )}

            {!isLoading && filteredProjects.length === 0 && (
              <div className="mt-6 rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 px-5 py-8 text-center text-sky-100/70">
                No projects matched that search yet. Try clearing the term or choosing another topic.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
