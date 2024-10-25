'use client'

import { useState, useEffect } from 'react'
import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('https://api.github.com/users/cooperfeatherstonellc/repos')
      .then(response => response.json())
      .then(data => setProjects(data.slice(0, 12))) // Displaying only the first 12 projects
      .catch(error => console.error('Error fetching projects:', error))
  }, [])

  return (
    <section className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-800">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-50 rounded-lg shadow-md p-4 flex flex-col h-full">
              <Image
                src={`https://opengraph.githubassets.com/1/${project.html_url.split('github.com/')[1]}`}
                alt={project.name}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow overflow-hidden">
                {project.description || "No description available."}
              </p>
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
          ))}
        </div>
      </div>
    </section>
  )
}