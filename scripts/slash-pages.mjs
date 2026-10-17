// GitHub Pages serves /ecosystem from out/ecosystem.html but /ecosystem/ needs out/ecosystem/index.html.
// Copy each exported top-level page (except index and 404) into <name>/index.html. Assets use absolute /_next paths.
import fs from 'node:fs'
import path from 'node:path'

const out = path.resolve('out')
for (const f of fs.readdirSync(out)) {
  if (!f.endsWith('.html') || f === 'index.html' || f === '404.html') continue
  const name = f.slice(0, -5)
  const dir = path.join(out, name)
  fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(path.join(out, f), path.join(dir, 'index.html'))
  console.log(`slash-pages: ${name}/index.html`)
}
