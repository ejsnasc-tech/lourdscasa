import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import CheckoutModal from './CheckoutModal'

const fmt = (n: number) =>
  'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const CartDrawer = () => {
  const { items, remove, updateQty, total, count, open, setOpen, clear } = useCart()
  const [checkout, setCheckout] = useState(false)

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-background z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-foreground" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Carrinho
            </h2>
            {count > 0 && (
              <span className="bg-accent text-accent-foreground font-body text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <ShoppingBag size={48} className="text-muted-foreground/30" />
              <div>
                <p className="font-heading text-lg text-foreground">Carrinho vazio</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Adicione pijamas ao carrinho para continuar
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="font-body text-xs uppercase tracking-widest text-accent hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-card rounded-xl p-3 border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="font-heading text-sm font-medium text-foreground mt-0.5 leading-tight">
                      {item.name}
                    </p>
                    {item.size && (
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        Tamanho: <span className="font-semibold text-foreground">{item.size}</span>
                      </p>
                    )}
                    <p className="font-body text-sm font-semibold text-foreground mt-1">
                      {fmt(item.priceValue * item.qty)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-body text-sm text-foreground">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        aria-label="Remover item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-muted-foreground">Subtotal</span>
              <span className="font-heading text-xl font-semibold text-foreground">
                {fmt(total)}
              </span>
            </div>
            <p className="font-body text-xs text-muted-foreground -mt-2">
              Frete a combinar no WhatsApp
            </p>

            {/* CTA */}
            <button
              onClick={() => { setCheckout(true) }}
              className="w-full bg-accent text-accent-foreground font-body text-sm uppercase tracking-widest py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Finalizar Pedido
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full font-body text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>

      {checkout && (
        <CheckoutModal
          onClose={() => setCheckout(false)}
          onSuccess={() => { setCheckout(false); setOpen(false); clear() }}
        />
      )}
    </>
  )
}

export default CartDrawer
