import { MessageCircle } from 'lucide-react'

interface ProductCardProps {
  image: string
  name: string
  price: string
  originalPrice?: string
  category: string
  isNew?: boolean
}

/** Converte "R$ 249,90" → 249.90 */
const parseBRL = (value: string) =>
  parseFloat(value.replace('R$', '').trim().replace(/\./g, '').replace(',', '.'))

/** Calcula o % de desconto entre preço atual e original */
const calcDiscount = (price: string, original: string): number | null => {
  const p = parseBRL(price)
  const o = parseBRL(original)
  if (!isFinite(p) || !isFinite(o) || o === 0) return null
  const pct = Math.round((1 - p / o) * 100)
  return pct > 0 ? pct : null
}

/** Monta o link do WhatsApp com mensagem pré-preenchida */
const buildWhatsApp = (name: string, price: string) => {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no ${name} — ${price}. Poderia me passar mais informações?`,
  )
  return `https://wa.me/5511999999999?text=${msg}`
}

const ProductCard = ({ image, name, price, originalPrice, category, isNew }: ProductCardProps) => {
  const discount = originalPrice ? calcDiscount(price, originalPrice) : null

  return (
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

        {/* Badge Desconto (% calculado automaticamente) */}
        {discount && (
          <span className="absolute top-3 right-3 bg-foreground text-background text-xs font-body font-semibold px-3 py-1 rounded-sm">
            -{discount}%
          </span>
        )}

        {/* Overlay WhatsApp — aparece e sobe no hover */}
        <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <a
            href={buildWhatsApp(name, price)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-[#25D366] text-white font-body text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-sm transition-all duration-300 translate-y-4 group-hover:translate-y-0 hover:bg-[#1fba5a]"
          >
            <MessageCircle size={15} />
            Pedir no WhatsApp
          </a>
        </div>
      </div>

      {/* Informações */}
      <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">
        {category}
      </p>
      <h3 className="font-heading text-lg font-medium text-foreground mb-1">{name}</h3>
      <div className="flex items-center gap-2">
        <span className="font-body text-base font-semibold text-foreground">{price}</span>
        {originalPrice && (
          <span className="font-body text-sm text-muted-foreground line-through">
            {originalPrice}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductCard
