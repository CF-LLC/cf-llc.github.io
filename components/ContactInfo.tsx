'use client'

import { Mail, Github, Instagram, Twitter, Video, SquarePlus } from 'lucide-react'

const contactInfo = [
  { icon: SquarePlus, label: 'Apply', url: '#', isApply: true },
  { icon: Mail, label: 'Email', url: 'mailto:cooperfeatherstonellc@gmail.com' },
  { icon: Github, label: 'GitHub', url: 'https://github.com/cooperfeatherstonellc' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/helpfulgrowthtips' },
  { icon: Twitter, label: 'X (Twitter)', url: 'https://x.com/TipsFromACEO' },
  { icon: Video, label: 'TikTok', url: 'https://tiktok.com/@helpfulgrowthtips' },
]

export default function ContactInfo() {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Contact CF LLC</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {contactInfo.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-80 transition-colors shadow hover:shadow-md ${
              item.isApply ? 'bg-custom-green text-indigo-600' : 'bg-indigo-600 text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}