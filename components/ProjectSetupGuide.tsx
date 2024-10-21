import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react'

const projects = [
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

export default function ProjectSetupGuide() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)

  const toggleProject = (projectName: string) => {
    setExpandedProject(expandedProject === projectName ? null : projectName)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(text)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Project Setup Guides</h2>
      {projects.map((project) => (
        <div key={project.name} className="mb-4">
          <button
            className="w-full flex justify-between items-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            onClick={() => toggleProject(project.name)}
          >
            <span>{project.name}</span>
            {expandedProject === project.name ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {expandedProject === project.name && (
            <ol className="mt-2 space-y-2 pl-4">
              {project.steps.map((step, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{index + 1}.</span>
                  <code className="bg-gray-100 px-2 py-1 rounded flex-grow">{step}</code>
                  <button
                    className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => copyToClipboard(step)}
                  >
                    {copiedStep === step ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </section>
  )
}