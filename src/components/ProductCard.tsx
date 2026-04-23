import { useState } from 'react'
import { ShoppingBag, X } from 'lucide-react'
import { getSettings } from '@/store'
import { useCart, parseBRL } from '@/context/CartContext'
import type { SizeStock } from '@/data/products'

interface ProductCardProps {
  id: number
  image: string
  name: string
  price: string
  originalPrice?: string
  category: string
  isNew?: boolean
  sizes?: SizeStock[]
}

const calcDiscount = (price: string, original: string): number | null => {
  const p = parseBRL(price)
  const o = parseBRL(original)
  if (!isFinite(p) || !isFinite(o) || o === 0) return null
  const pct = Math.round((1 - p / o) * 100)
  return pct > 0 ? pct : null
}

// ── Size picker modal ─────────────────────────────────────────────────────────
interface SizeModalProps {
  product: ProductCardProps
  onClose: () => void
  onAdd: (size: string) => void
}

const SizeModal = ({ product, onClose, onAdd }: SizeModalProps) => (
  <div
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-background border border-border rounded-2xl p-6 w-full max-w-xs shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading text-lg font-medium text-foreground">Selecionar Tamanho</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={18} />
        </button>
      </div>
      <p className="font-body text-sm text-muted-foreground mb-4">{product.name}</p>
      <div className="grid grid-cols-3 gap-2">
        {product.sizes!.filter((s) => s.size.trim()).map((s) => (
          <button
            key={s.size}
            disabled={s.stock === 0}
            onClick={() => { onAdd(s.size); onClose() }}
            className={`py-2.5 rounded-lg border font-body text-sm font-medium transition-all ${
              s.stock === 0
                ? 'border-border text-muted-foreground/30 line-through cursor-not-allowed'
                : 'border-border text-foreground hover:border-accent hover:bg-accent/5'
            }`}
          >
            {s.size}
            {s.stock > 0 && s.stock <= 3 && (
              <span className="block text-[9px] text-amber-500">Últimas</span>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
)

// ── Main card ─────────────────────────────────────────────────────────────────
const ProductCard = (props: ProductCardProps) => {
  const { id, image, name, price, originalPrice, category, isNew, sizes } = props
  const { add } = useCart()
  const { whatsapp } = getSettings()
  const [showSizes, setShowSizes] = useState(false)
  const [added, setAdded] = useState(false)

  const discount = originalPrice ? calcDiscount(price, originalPrice) : null
  const hasSizes = sizes && sizes.some((s) => s.size.trim())

  const doAdd = (size = '') => {
    add({
      id: `${id}-${size}`,
      productId: id,
      name,
      image,
      price,
      priceValue: parseBRL(price),
      category,
      size,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleAddToCart = () => {
    if (hasSizes) { setShowSizes(true) } else { doAdd() }
  }

  const waMsg = encodeURIComponent(
    `Olá! Tenho interesse no ${name} — ${price}. Poderia me passar mais informações?`,
  )

  return (
    <>
      <div className="group cursor-pointer">
        {/* Imagem */}
        <div className="relative overflow-hidden rounded-lg bg-card aspect-[3/4] mb-4">
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={800}
            height={1066}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badge Novo */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-body font-semibold tracking-wider uppercase px-3 py-1 rounded-sm">
              Novo
            </span>
          )}

          {/* Badge Desconto */}
          {discount && (
            <span className="absolute top-3 right-3 bg-foreground text-background text-xs font-body font-semibold px-3 py-1 rounded-sm">
              -{discount}%
            </span>
          )}

          {/* Overlay — dois botões no hover */}
          <div className="absolute inset-0 bg-foreground/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 gap-2">
            {/* Adicionar ao carrinho */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 translate-y-4 group-hover:translate-y-0 w-[85%] justify-center ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <ShoppingBag size={14} />
              {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsapp}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-[#25D366] text-white font-body text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm w-[85%] justify-center transition-all duration-300 translate-y-4 group-hover:translate-y-0 hover:bg-[#1fba5a]"
              style={{ transitionDelay: '40ms' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir no WhatsApp
            </a>
          </div>
        </div>

        {/* Informações */}
        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">{category}</p>
        <h3 className="font-heading text-lg font-medium text-foreground mb-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-body text-base font-semibold text-foreground">{price}</span>
          {originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">{originalPrice}</span>
          )}
        </div>
      </div>

      {showSizes && (
        <SizeModal
          product={props}
          onClose={() => setShowSizes(false)}
          onAdd={doAdd}
        />
      )}
    </>
  )
}

export default ProductCard
