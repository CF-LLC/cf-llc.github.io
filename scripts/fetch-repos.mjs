// Build-time repo fetch for the My Ecosystem page.
// Public repos only (visibility filter + unauthenticated-equivalent data). Private repos are never requested by name:
// the page only shows an anonymous count from data/ecosystem.json. On any API failure the committed snapshot is kept.
import fs from 'node:fs'

const cfg = JSON.parse(fs.readFileSync(new URL('../data/ecosystem.json', import.meta.url), 'utf8'))
const OUT = new URL('../data/repos.json', import.meta.url)
const token = process.env.GITHUB_TOKEN // optional; only raises the rate limit (Actions' token cannot see other private repos)
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'cf-llc-ecosystem-build', ...(token ? { Authorization: `Bearer ${token}` } : {}) }

// Never publish homepages on spockshop.com subdomains except the public ones.
function safeHomepage(raw) {
  if (!raw) return null
  try {
    const u = new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`)
    if (!/^https?:$/.test(u.protocol)) return null
    if (u.hostname.endsWith('spockshop.com') && !/^(?:www\.|blog\.)?spockshop\.com$/.test(u.hostname)) return null
    return u.toString()
  } catch { return null }
}

async function isUp(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 8000)
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (cf-llc ecosystem link check)' } })
    return r.status >= 200 && r.status < 400
  } catch { return false } finally { clearTimeout(t) }
}

async function list(owner) {
  const kind = owner.type === 'org' ? 'orgs' : 'users'
  const out = []
  for (let page = 1; page < 10; page++) {
    const r = await fetch(`https://api.github.com/${kind}/${owner.login}/repos?type=public&per_page=100&page=${page}`, { headers })
    if (!r.ok) throw new Error(`${owner.login}: HTTP ${r.status}`)
    const batch = await r.json()
    out.push(...batch)
    if (batch.length < 100) break
  }
  return out.filter((r) => r.private === false && r.visibility !== 'private')
}

async function main() {
  const raw = (await Promise.all(cfg.repos.owners.map(list))).flat()
  const siteMap = cfg.repos.siteMap
  const repos = raw.map((r) => ({
    full: r.full_name, name: r.name, owner: r.owner.login,
    desc: (r.description || '').slice(0, 160), url: r.html_url,
    homepage: safeHomepage(r.homepage), lang: r.language || null, fork: !!r.fork, archived: !!r.archived,
    pushed: (r.pushed_at || '').slice(0, 10), sites: siteMap[r.full_name] || [],
  }))
  // Live = mapped to a site node, or has a homepage that answers right now.
  const queue = [...repos]
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (let r; (r = queue.shift());) r.live = r.sites.length > 0 || (r.homepage && !r.fork ? await isUp(r.homepage) : false) // a fork's homepage is usually upstream's site
  }))
  for (const r of repos) {
    if (!r.sites.length && r.live && r.homepage && new URL(r.homepage).hostname === 'cf-llc.github.io') r.sites = ['site']
    if (!r.live) r.homepage = null // only link to sites that are up
  }
  repos.sort((a, b) => a.full.localeCompare(b.full))
  const data = { generatedAt: new Date().toISOString(), public: repos, private: cfg.repos.private }
  fs.writeFileSync(OUT, JSON.stringify(data, null, 1) + '\n')
  console.log(`repos: ${repos.length} public (${repos.filter((r) => r.live).length} live), ${cfg.repos.private.count} private (anonymous)`)
}

main().catch((e) => {
  console.warn('fetch-repos: keeping committed snapshot:', e.message)
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, JSON.stringify({ generatedAt: null, public: [], private: cfg.repos.private }) + '\n')
})
