import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

const contactInfo = [
  { icon: Github, label: 'GitHub', url: 'https://github.com/yourusername' },
  { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/yourlinkedinprofile' },
  { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/yourtwitterhandle' },
  { icon: Mail, label: 'Email', url: 'mailto:your.email@example.com' },
]

export default function ContactInfo() {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Get in Touch</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {contactInfo.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}