import { useEffect, useState } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import { profile } from '../data'
import { scrollToTop } from '../lib/scroll'
import { SocialRow } from './Socials'

export default function Footer() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <footer className="footer">
        <div className="container footer-inner">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}. Built with React and Three.js.
          </p>
          <SocialRow className="footer-social" />
        </div>
      </footer>

      <button
        type="button"
        className={`to-top ${showTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        data-cursor="Top"
        tabIndex={showTop ? 0 : -1}
      >
        <FaChevronUp />
      </button>
    </>
  )
}
