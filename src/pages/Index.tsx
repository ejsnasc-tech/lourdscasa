import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CatalogSection from '@/components/CatalogSection'
import AboutSection from '@/components/AboutSection'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import PromoBanner from '@/components/PromoBanner'
import CartDrawer from '@/components/CartDrawer'
import { getProducts, getSettings } from '@/store'
import type { Filter } from '@/data/products'

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('Todos')
  const [products] = useState(getProducts)
  const [settings] = useState(getSettings)

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner settings={settings} />
      <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <HeroSection />
      <CatalogSection
        products={products}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <AboutSection />
      <Footer whatsapp={settings.whatsapp} />
      <BackToTop />
      <CartDrawer />
    </div>
  )
}

export default Index
