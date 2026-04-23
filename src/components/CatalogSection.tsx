import ProductCard from './ProductCard'
import type { Product, Filter } from '@/data/products'

const filterList: Filter[] = ['Todos', 'Feminino', 'Masculino', 'Infantil', 'Novidades']

interface CatalogSectionProps {
  products: Product[]
  activeFilter: Filter
  onFilterChange: (f: Filter) => void
}

const CatalogSection = ({ products, activeFilter, onFilterChange }: CatalogSectionProps) => {
  const filtered =
    activeFilter === 'Todos'
      ? products
      : activeFilter === 'Novidades'
      ? products.filter((p) => p.isNew)
      : products.filter((p) => p.category === activeFilter)

  return (
    <section id="catalogo" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Título */}
        <div className="text-center mb-14">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Catálogo
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground">
            Nossos Pijamas
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-3">
            {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {filterList.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`font-body text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-foreground text-background scale-105'
                  : 'bg-card text-muted-foreground hover:bg-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid — key força re-mount e re-anima ao trocar filtro */}
        <div
          key={activeFilter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'both' }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CatalogSection
