import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface CartItem {
  id: string        // productId + size
  productId: number
  name: string
  image: string
  price: string     // "R$ 189,90"
  priceValue: number
  category: string
  size: string
  qty: number
}

interface CartContextType {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  total: number
  count: number
  open: boolean
  setOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

const parseBRL = (value: string) =>
  parseFloat(value.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')) || 0

const STORAGE_KEY = 'lourds_cart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const add = (item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
    setOpen(true)
  }

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { remove(id); return }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i))
  }

  const clear = () => setItems([])

  const total = items.reduce((acc, i) => acc + i.priceValue * i.qty, 0)
  const count = items.reduce((acc, i) => acc + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}

export { parseBRL }
