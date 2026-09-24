import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { profile, projects } from '../data'
import { iconMap } from './icons'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'

const STATUS = {
  active: 'Active',
  progress: 'In progress',
  planned: 'Planned',
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'progress', label: 'In progress' },
  { id: 'planned', label: 'Planned' },
]

function RepoCard({ p }) {
  const Icon = iconMap[p.icon] || iconMap.code
  const url = p.url ?? (p.status !== 'planned' ? `${profile.github}/${p.repo}` : null)

  return (
    <TiltCard className={`repo ${p.status}`} innerClassName="repo-inner" max={6}>
      <div className="repo-top pop">
        <span className="repo-icon">
          <Icon aria-hidden="true" />
        </span>
        <span className={`badge ${p.status}`}>{STATUS[p.status]}</span>
      </div>
      <h3 className="repo-name pop-sm">{p.repo}</h3>
      <p className="repo-desc">{p.description}</p>
      <ul className="chips small">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {url ? (
        <a className="repo-link pop" href={url} target="_blank" rel="noreferrer noopener" data-cursor="Open">
          View on GitHub <FaExternalLinkAlt aria-hidden="true" />
        </a>
      ) : (
        <span className="repo-link disabled">Repository coming soon</span>
      )}
    </TiltCard>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    const c = { all: projects.length, active: 0, progress: 0, planned: 0 }
    projects.forEach((p) => {
      c[p.status] += 1
    })
    return c
  }, [])

  const visible = filter === 'all' ? projects : projects.filter((p) => p.status === filter)

  return (
    <Section id="projects" title="Projects" meta={`${projects.length} repositories on GitHub`}>
      <div className="filters" role="tablist" aria-label="Filter projects by status">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`filter ${filter === f.id ? 'on' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {filter === f.id && (
              <motion.span
                layoutId="filter-pill"
                className="filter-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="filter-text">
              {f.label} <em>{counts[f.id]}</em>
            </span>
          </button>
        ))}
      </div>

      <ul className="repo-grid" key={filter}>
        {visible.map((p, i) => (
          <Reveal as="li" key={p.repo} delay={(i % 3) * 0.09} y={46}>
            <RepoCard p={p} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
