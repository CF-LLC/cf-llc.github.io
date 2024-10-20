import { useState, useEffect } from 'react'
import { Github, ExternalLink } from 'lucide-react'

interface Project {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
}

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('https://api.github.com/users/yourusername/repos')
      .then(response => response.json())
      .then(data => setProjects(data.slice(0, 6))) // Display up to 6 projects
      .catch(error => console.error('Error fetching projects:', error))
  }, [])

  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8">Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {project.description || "No description available."}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => window.open(project.html_url, '_blank')}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </button>
              {project.homepage && (
                <button
                  onClick={() => window.open(project.homepage, '_blank')}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}