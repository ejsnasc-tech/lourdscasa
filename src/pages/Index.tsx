import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CatalogSection from '@/components/CatalogSection'
import AboutSection from '@/components/AboutSection'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import type { Filter } from '@/data/products'

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('Todos')

  return (
    <div className="min-h-screen bg-background">
      <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <HeroSection />
      <CatalogSection activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <AboutSection />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Index
