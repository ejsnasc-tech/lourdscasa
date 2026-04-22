import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { Filter } from '@/data/products'

interface HeaderProps {
  activeFilter: Filter
  onFilterChange: (f: Filter) => void
}

const navItems: { label: string; filter: Filter }[] = [
  { label: 'Feminino', filter: 'Feminino' },
  { label: 'Masculino', filter: 'Masculino' },
  { label: 'Infantil', filter: 'Infantil' },
  { label: 'Novidades', filter: 'Novidades' },
]

const Header = ({ activeFilter, onFilterChange }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (filter: Filter) => {
    onFilterChange(filter)
    setIsOpen(false)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-foreground/96 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 py-5 flex items-center justify-between">
        <a href="/" className="font-heading text-2xl font-bold tracking-wider text-secondary">
          LOURDS
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ label, filter }) => (
            <button
              key={label}
              onClick={() => handleNavClick(filter)}
              className={`font-body text-sm uppercase tracking-widest transition-colors ${
                activeFilter === filter
                  ? 'text-accent'
                  : 'text-secondary/75 hover:text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-secondary"
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-secondary/10 px-6 py-6">
          {navItems.map(({ label, filter }) => (
            <button
              key={label}
              onClick={() => handleNavClick(filter)}
              className={`block w-full text-left font-body text-sm uppercase tracking-widest py-3 transition-colors ${
                activeFilter === filter
                  ? 'text-accent'
                  : 'text-secondary/75 hover:text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
