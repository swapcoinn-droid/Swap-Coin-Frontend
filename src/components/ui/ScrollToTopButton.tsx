import { useEffect, useState } from 'react'

import { ArrowUpIcon } from '../icons/AuthIcons'

import './scroll-to-top-button.css'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={['sc-scroll-top', isVisible ? 'is-visible' : ''].filter(Boolean).join(' ')}
      aria-label="Volver arriba"
      onClick={scrollToTop}
    >
      <ArrowUpIcon />
    </button>
  )
}
