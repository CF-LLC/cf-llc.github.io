'use client'

import { Mail, Github, Instagram, Twitter, Video, SquarePlus } from 'lucide-react'

const contactInfo = [
  { icon: SquarePlus, label: 'Apply', url: '#', color: '#90EE90' },
  { icon: Mail, label: 'Email', url: 'mailto:cooperfeatherstonellc@gmail.com' },
  { icon: Github, label: 'GitHub', url: 'https://github.com/cooperfeatherstonellc' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/helpfulgrowthtips' },
  { icon: Twitter, label: 'X (Twitter)', url: 'https://twitter.com/yourtwitterhandle' },
  { icon: Video, label: 'TikTok', url: 'https://www.tiktok.com/@yourtiktokhandle' },
]

export default function ContactInfo() {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-800">Contact</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {contactInfo.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 px-4 py-2 ${
              item.color ? `bg-[${item.color}] text-indigo-600` : 'bg-indigo-600 text-white'
            } rounded-lg hover:opacity-80 transition-colors shadow hover:shadow-md`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}