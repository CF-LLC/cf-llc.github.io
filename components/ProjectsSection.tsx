'use client'

import { useState, useEffect } from 'react'
import { Github, ExternalLink, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react'

interface Project {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
}

const setupProjects = [
  {
    name: 'Project A',
    steps: [
      'Clone the repository: git clone https://github.com/yourusername/project-a.git',
      'Install dependencies: npm install',
      'Run the development server: npm run dev',
    ],
  },
  {
    name: 'Project B',
    steps: [
      'Clone the repository: git clone https://github.com/yourusername/project-b.git',
      'Install dependencies: yarn install',
      'Build the project: yarn build',
      'Start the application: yarn start',
    ],
  },
]

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<'view' | 'copy'>('view')
  const [projects, setProjects] = useState<Project[]>([])
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/users/cooperfeatherstonellc/repos')
      .then(response => response.json())
      .then(data => setProjects(data.slice(0, 6))) // Display up to 6 projects
      .catch(error => console.error('Error fetching projects:', error))
  }, [])

  const toggleProject = (projectName: string) => {
    setExpandedProject(expandedProject === projectName ? null : projectName)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(text)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <section className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex text-lg font-semibold">
        <button
          className={`flex-1 py-4 px-6 focus:outline-none transition-colors ${
            activeTab === 'view'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('view')}
        >
          View My Projects
        </button>
        <button
          className={`flex-1 py-4 px-6 focus:outline-none transition-colors ${
            activeTab === 'copy'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('copy')}
        >
          Copy My Projects
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'view' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-2 text-indigo-700">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">
                  {project.description || "No description available."}
                </p>
                <div className="flex justify-between">
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
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {setupProjects.map((project) => (
              <div key={project.name} className="bg-gray-50 rounded-lg shadow">
                <button
                  className="w-full flex justify-between items-center py-4 px-6 focus:outline-none hover:bg-gray-100 transition-colors"
                  onClick={() => toggleProject(project.name)}
                >
                  <span className="font-semibold text-indigo-700">{project.name}</span>
                  {expandedProject === project.name ? (
                    <ChevronUp className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-indigo-600" />
                  )}
                </button>
                {expandedProject === project.name && (
                  <ol className="mt-2 space-y-2 p-4 bg-white rounded-b-lg">
                    {project.steps.map((step, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-indigo-600 font-semibold">{index + 1}.</span>
                        <code className="bg-gray-100 px-2 py-1 rounded flex-grow text-sm">{step}</code>
                        <button
                          className="ml-2 text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
                          onClick={() => copyToClipboard(step)}
                        >
                          {copiedStep === step ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}