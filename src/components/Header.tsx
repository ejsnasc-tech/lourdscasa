import { useEffect, useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import type { Filter } from '@/data/products'
import { useCart } from '@/context/CartContext'

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
  const cartCtx = useCart()

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

        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={() => cartCtx.setOpen(true)}
            aria-label="Carrinho"
            className="relative text-secondary hover:text-accent transition-colors"
          >
            <ShoppingBag size={22} />
            {cartCtx.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground font-body text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCtx.count > 9 ? '9+' : cartCtx.count}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-secondary"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
