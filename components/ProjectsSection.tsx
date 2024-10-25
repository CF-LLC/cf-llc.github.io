'use client'

import { useState, useEffect } from 'react'
import { Github, ExternalLink, Search, Code, File } from 'lucide-react'
import { motion } from 'framer-motion'

interface Project {
  id: number
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

const languageColors: { [key: string]: string } = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  Python: 'bg-green-400',
  Java: 'bg-orange-400',
  'C#': 'bg-purple-400',
  Ruby: 'bg-red-400',
  // Add more languages and colors as needed
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])

  useEffect(() => {
    fetch('https://api.github.com/users/cooperfeatherstonellc/repos')
      .then(response => response.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          const projectsWithTopics = data.map((project: unknown) => {
            const typedProject = project as ApiProject
            return {
              id: typedProject.id,
              name: typedProject.name,
              description: typedProject.description,
              html_url: typedProject.html_url,
              homepage: typedProject.homepage,
              language: typedProject.language,
              topics: Array.isArray(typedProject.topics) ? typedProject.topics : []
            }
          })
          setProjects(projectsWithTopics)
          setFilteredProjects(projectsWithTopics)

          // Extract unique categories
          const allCategories = ['All', ...Array.from(new Set(projectsWithTopics.flatMap(project => project.topics)))]
          setCategories(allCategories)
        }
      })
      .catch(error => console.error('Error fetching projects:', error))
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
    <section className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Explore Our Projects</h2>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <div className={`relative p-4 ${project.language && languageColors[project.language] ? languageColors[project.language] : 'bg-gray-300'}`}>
              <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                {project.language ? (
                  <Code className="w-5 h-5" />
                ) : (
                  <File className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
              <p className="text-sm text-white mb-4 line-clamp-3">
                {project.description || "No description available."}
              </p>
            </div>
            <div className="p-4 flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.topics.slice(0, 3).map(topic => (
                  <span key={topic} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-auto">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
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
    </section>
  )
}