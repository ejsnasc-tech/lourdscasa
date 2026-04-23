import { useState } from 'react'
import {
  LogOut, Package, Megaphone, Settings, Plus, Pencil, Trash2,
  Eye, EyeOff, RotateCcw, ExternalLink, X, LayoutDashboard,
  ShoppingBag, Sparkles, Tag, Trash,
} from 'lucide-react'
import {
  getProducts, saveProducts,
  getSettings, saveSettings,
  checkAdminPassword, setAdminPassword,
  getAdminSession, setAdminSession, clearAdminSession,
} from '@/store'
import { products as defaultProducts } from '@/data/products'
import type { Product, Category, SizeStock } from '@/data/products'
import type { SiteSettings } from '@/store'

const genId = () => Math.floor(Math.random() * 1e9)

// ── Campo reutilizável ────────────────────────────────────────────────────────
const Field = ({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="font-body text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
      {label}{required && ' *'}
    </label>
    {children}
  </div>
)

const inputCls =
  'w-full bg-background border border-border rounded px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent transition-colors font-body placeholder:text-muted-foreground/50'

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkAdminPassword(pw)) { setAdminSession(); onLogin() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="font-body text-[10px] text-secondary/30 text-center uppercase tracking-[0.4em] mb-2">
          Painel Administrativo
        </p>
        <h1 className="font-heading text-5xl font-bold text-secondary text-center mb-10">LOURDS</h1>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <input
              autoFocus
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(false) }}
              placeholder="Senha de acesso"
              className={`w-full bg-secondary/5 border rounded px-4 py-3 text-sm text-secondary outline-none pr-10 transition-colors font-body placeholder:text-secondary/25 ${
                err ? 'border-red-400' : 'border-secondary/10 focus:border-accent'
              }`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/25 hover:text-secondary/60 transition-colors"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {err && (
            <p className="font-body text-xs text-red-400">Senha incorreta. Tente novamente.</p>
          )}
          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest py-3.5 rounded hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>

        <p className="font-body text-[10px] text-secondary/20 text-center mt-8">
          Senha padrão: <span className="text-secondary/40">lourds2026</span>
        </p>
      </div>
    </div>
  )
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'products' | 'banner' | 'settings'

interface SidebarProps {
  tab: Tab
  setTab: (t: Tab) => void
  onLogout: () => void
}

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'products', label: 'Produtos', icon: <ShoppingBag size={16} /> },
  { id: 'banner', label: 'Promoção', icon: <Megaphone size={16} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={16} /> },
]

const Sidebar = ({ tab, setTab, onLogout }: SidebarProps) => (
  <aside className="fixed left-0 top-0 bottom-0 w-52 bg-foreground flex flex-col z-50">
    {/* Logo */}
    <div className="px-6 py-7 border-b border-secondary/8">
      <p className="font-heading text-2xl font-bold tracking-wider text-secondary">LOURDS</p>
      <p className="font-body text-[9px] text-secondary/30 uppercase tracking-[0.35em] mt-0.5">
        Painel Admin
      </p>
    </div>

    {/* Nav */}
    <nav className="flex-1 py-4">
      {navItems.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={`w-full flex items-center gap-3 px-6 py-3 font-body text-xs uppercase tracking-widest transition-all text-left ${
            tab === id
              ? 'bg-accent/15 text-accent border-r-2 border-accent'
              : 'text-secondary/45 hover:text-secondary/80 hover:bg-secondary/5'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>

    {/* Footer */}
    <div className="border-t border-secondary/8 p-4 space-y-1">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-2.5 px-2 py-2 font-body text-xs text-secondary/35 hover:text-secondary/70 transition-colors"
      >
        <ExternalLink size={13} /> Ver loja
      </a>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-2 py-2 font-body text-xs text-secondary/35 hover:text-red-400 transition-colors"
      >
        <LogOut size={13} /> Sair
      </button>
    </div>
  </aside>
)

// ── STAT CARD ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="font-heading text-3xl font-semibold text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  </div>
)

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
const DashboardTab = ({ products }: { products: Product[] }) => {
  const novidades = products.filter((p) => p.isNew).length
  const promocoes = products.filter((p) => p.originalPrice).length
  const cats = new Set(products.map((p) => p.category)).size

  return (
    <div>
      <h2 className="font-heading text-3xl font-semibold text-foreground mb-8">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Produtos Cadastrados"
          value={products.length}
          icon={<Package size={20} className="text-violet-500" />}
          color="bg-violet-50"
        />
        <StatCard
          label="Novidades"
          icon={<Sparkles size={20} className="text-rose-400" />}
          value={novidades}
          color="bg-rose-50"
        />
        <StatCard
          label="Em Promoção"
          icon={<Tag size={20} className="text-amber-500" />}
          value={promocoes}
          color="bg-amber-50"
        />
        <StatCard
          label="Categorias"
          icon={<LayoutDashboard size={20} className="text-sky-500" />}
          value={cats}
          color="bg-sky-50"
        />
      </div>

      {/* Product list preview */}
      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Catálogo Atual
        </h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="font-body text-[10px] uppercase tracking-widest text-muted-foreground px-5 py-3 text-left">
                  Foto
                </th>
                <th className="font-body text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-3 text-left">
                  Nome
                </th>
                <th className="font-body text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-3 text-left hidden md:table-cell">
                  Categoria
                </th>
                <th className="font-body text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-3 text-left">
                  Preço
                </th>
                <th className="font-body text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-3 text-left hidden md:table-cell">
                  Badge
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-muted/30 ${i !== products.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <td className="px-5 py-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-heading text-sm font-medium text-foreground">{p.name}</p>
                    {p.description && (
                      <p className="font-body text-xs text-muted-foreground truncate max-w-[180px]">
                        {p.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-body text-xs text-accent">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-semibold text-foreground">{p.price}</p>
                    {p.originalPrice && (
                      <p className="font-body text-xs text-muted-foreground line-through">
                        {p.originalPrice}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {p.isNew && (
                        <span className="font-body text-[10px] bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">
                          Novo
                        </span>
                      )}
                      {p.originalPrice && (
                        <span className="font-body text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                          Promoção
                        </span>
                      )}
                      {!p.isNew && !p.originalPrice && (
                        <span className="font-body text-[10px] text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── PRODUCT FORM MODAL ────────────────────────────────────────────────────────
interface ProductFormProps {
  initial: Partial<Product>
  onSave: (p: Omit<Product, 'id'>) => void
  onClose: () => void
}

type Badge = 'none' | 'new' | 'promo'

const ProductFormModal = ({ initial, onSave, onClose }: ProductFormProps) => {
  const [name, setName] = useState(initial.name ?? '')
  const [category, setCategory] = useState<Category>(initial.category ?? 'Feminino')
  const [badge, setBadge] = useState<Badge>(
    initial.isNew ? 'new' : initial.originalPrice ? 'promo' : 'none',
  )
  const [description, setDescription] = useState(initial.description ?? '')
  const [price, setPrice] = useState(initial.price ?? '')
  const [originalPrice, setOriginalPrice] = useState(initial.originalPrice ?? '')
  const [image, setImage] = useState(initial.image ?? '')
  const [imageLoading, setImageLoading] = useState(false)
  const [sizes, setSizes] = useState<SizeStock[]>(
    initial.sizes && initial.sizes.length > 0
      ? initial.sizes
      : [{ size: '', stock: 0 }],
  )

  const addSize = () => setSizes((s) => [...s, { size: '', stock: 0 }])
  const removeSize = (i: number) => setSizes((s) => s.filter((_, idx) => idx !== i))
  const updateSize = (i: number, field: keyof SizeStock, value: string | number) =>
    setSizes((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const canSave = name.trim() && price.trim() && image.trim()

  const handleSave = () => {
    if (!canSave) return
    onSave({
      image: image.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      price: price.trim(),
      originalPrice: badge === 'promo' && originalPrice.trim() ? originalPrice.trim() : undefined,
      category,
      isNew: badge === 'new',
      sizes: sizes.filter((s) => s.size.trim()),
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            {initial.id ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Nome */}
          <Field label="Nome do Produto" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pijama Rosé Clássico"
              className={inputCls}
            />
          </Field>

          {/* Categoria + Badge */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inputCls}
              >
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Infantil">Infantil</option>
              </select>
            </Field>
            <Field label="Badge (opcional)">
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as Badge)}
                className={inputCls}
              >
                <option value="none">Nenhum</option>
                <option value="new">Novo</option>
                <option value="promo">Promoção</option>
              </select>
            </Field>
          </div>

          {/* Descrição */}
          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição curta do produto..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço (R$)" required>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="189,90"
                className={inputCls}
              />
            </Field>
            <Field label="Preço Antigo (R$)">
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="229,90"
                disabled={badge !== 'promo'}
                className={`${inputCls} disabled:opacity-35 disabled:cursor-not-allowed`}
              />
            </Field>
          </div>

          {/* Foto */}
          <Field label="Foto do Produto" required>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors bg-card group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {imageLoading ? (
                <div className="py-8 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <p className="font-body text-xs text-muted-foreground">Carregando...</p>
                </div>
              ) : image ? (
                <div className="relative w-full">
                  <img
                    src={image}
                    alt="preview"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="font-body text-xs text-white uppercase tracking-widest">Trocar foto</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-accent transition-colors"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p className="font-body text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Clique para selecionar uma foto
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground/60">JPG, PNG, WEBP — até 5 MB</p>
                </div>
              )}
            </label>
          </Field>

          {/* Tamanhos e Estoque */}
          <Field label="Tamanhos e Estoque">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_auto] text-[10px] font-body uppercase tracking-widest text-muted-foreground border-b border-border px-3 py-2 gap-2">
                <span>Tamanho</span>
                <span>Estoque</span>
                <span className="w-5" />
              </div>
              {sizes.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[1fr_1fr_auto] gap-2 px-3 py-2 items-center ${
                    i < sizes.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <input
                    type="text"
                    value={row.size}
                    onChange={(e) => updateSize(i, 'size', e.target.value)}
                    placeholder="P, M, G…"
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-accent font-body"
                  />
                  <input
                    type="number"
                    min={0}
                    value={row.stock}
                    onChange={(e) => updateSize(i, 'stock', parseInt(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-accent font-body"
                  />
                  <button
                    onClick={() => removeSize(i)}
                    disabled={sizes.length === 1}
                    className="text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSize}
              className="mt-2 font-body text-xs text-accent hover:text-accent/70 transition-colors flex items-center gap-1"
            >
              <Plus size={12} /> Adicionar Tamanho
            </button>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-muted-foreground font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:border-foreground/30 hover:text-foreground transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Package size={13} /> Salvar Produto
          </button>
        </div>
      </div>
    </div>
  )
}

// ── PRODUCTS TAB ──────────────────────────────────────────────────────────────
interface ProductsTabProps {
  products: Product[]
  onUpdate: (p: Product[]) => void
}

const ProductsTab = ({ products, onUpdate }: ProductsTabProps) => {
  const [modal, setModal] = useState<{ product?: Product } | null>(null)

  const handleSave = (data: Omit<Product, 'id'>) => {
    if (modal?.product) {
      onUpdate(products.map((p) => (p.id === modal.product!.id ? { ...data, id: modal.product!.id } : p)))
    } else {
      onUpdate([...products, { ...data, id: genId() }])
    }
    setModal(null)
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('Remover este produto?')) return
    onUpdate(products.filter((p) => p.id !== id))
  }

  const handleRestore = () => {
    if (!window.confirm('Restaurar catálogo padrão? As alterações serão perdidas.')) return
    onUpdate(defaultProducts)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-foreground">Produtos</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRestore}
            className="flex items-center gap-1.5 border border-border text-muted-foreground font-body text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg hover:border-foreground/30 hover:text-foreground transition-all"
          >
            <RotateCcw size={13} /> Restaurar
          </button>
          <button
            onClick={() => setModal({})}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={13} /> Novo Produto
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[56px_1fr_120px_110px_auto] border-b border-border bg-muted/40 px-4 py-3 gap-4">
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Foto</span>
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Nome</span>
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground hidden md:block">Categoria</span>
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Preço</span>
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Ações</span>
        </div>

        {/* Rows */}
        {products.map((p, i) => (
          <div
            key={p.id}
            className={`grid grid-cols-[56px_1fr_120px_110px_auto] items-center px-4 py-3 gap-4 hover:bg-muted/30 transition-colors ${
              i < products.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <img src={p.image} alt={p.name} className="w-10 h-14 object-cover rounded" />

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-heading text-sm font-medium text-foreground truncate">{p.name}</p>
                {p.isNew && (
                  <span className="font-body text-[9px] bg-rose-100 text-rose-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Novo
                  </span>
                )}
                {p.originalPrice && (
                  <span className="font-body text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Oferta
                  </span>
                )}
              </div>
              {p.description && (
                <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
                  {p.description}
                </p>
              )}
            </div>

            <p className="font-body text-xs text-accent hidden md:block">{p.category}</p>

            <div>
              <p className="font-body text-sm font-semibold text-foreground">{p.price}</p>
              {p.originalPrice && (
                <p className="font-body text-xs text-muted-foreground line-through">{p.originalPrice}</p>
              )}
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setModal({ product: p })}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                title="Editar"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Remover"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <ProductFormModal
          initial={modal.product ?? {}}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ── BANNER TAB ────────────────────────────────────────────────────────────────
interface BannerTabProps {
  settings: SiteSettings
  onUpdate: (s: SiteSettings) => void
}

const BannerTab = ({ settings, onUpdate }: BannerTabProps) => (
  <div>
    <h2 className="font-heading text-3xl font-semibold text-foreground mb-8">Promoção</h2>

    {/* Preview */}
    <div className="mb-6">
      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        Pré-visualização
      </p>
      <div
        className={`py-3 px-6 rounded-lg text-center font-body text-sm transition-all ${
          settings.bannerActive
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground border border-dashed border-border'
        }`}
      >
        {settings.bannerActive ? settings.bannerText : 'Banner desativado — ative abaixo'}
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading text-base font-medium text-foreground">Ativar banner</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Exibido no topo do site para todos os visitantes
          </p>
        </div>
        <div
          onClick={() => onUpdate({ ...settings, bannerActive: !settings.bannerActive })}
          className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
            settings.bannerActive ? 'bg-accent' : 'bg-muted'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
              settings.bannerActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Text */}
      <div>
        <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Texto do Banner
        </label>
        <input
          type="text"
          value={settings.bannerText}
          onChange={(e) => onUpdate({ ...settings, bannerText: e.target.value })}
          className={inputCls}
        />
        <p className="font-body text-[11px] text-muted-foreground mt-1.5">
          Salvo automaticamente. Use emojis para destacar o texto.
        </p>
      </div>
    </div>
  </div>
)

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────
interface SettingsTabProps {
  settings: SiteSettings
  onUpdate: (s: SiteSettings) => void
}

const SettingsTab = ({ settings, onUpdate }: SettingsTabProps) => {
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [waNumber, setWaNumber] = useState(settings.whatsapp)
  const [waSaved, setWaSaved] = useState(false)

  const handleSaveWa = () => {
    onUpdate({ ...settings, whatsapp: waNumber })
    setWaSaved(true)
    setTimeout(() => setWaSaved(false), 3000)
  }

  const handleChangePw = () => {
    if (!checkAdminPassword(oldPw)) {
      setPwMsg({ text: 'Senha atual incorreta.', ok: false })
      return
    }
    if (newPw.length < 6) {
      setPwMsg({ text: 'A nova senha precisa ter ao menos 6 caracteres.', ok: false })
      return
    }
    setAdminPassword(newPw)
    setOldPw('')
    setNewPw('')
    setPwMsg({ text: 'Senha alterada com sucesso!', ok: true })
    setTimeout(() => setPwMsg(null), 4000)
  }

  return (
    <div>
      <h2 className="font-heading text-3xl font-semibold text-foreground mb-8">Configurações</h2>

      <div className="space-y-5">
        {/* WhatsApp */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground">WhatsApp</h3>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Número usado nos botões de pedido de cada produto
            </p>
          </div>
          <Field label="Número (somente dígitos — DDI + DDD + número)">
            <input
              type="text"
              value={waNumber}
              onChange={(e) => { setWaNumber(e.target.value.replace(/\D/g, '')); setWaSaved(false) }}
              placeholder="5579999998888"
              maxLength={15}
              className={inputCls}
            />
            <p className="font-body text-[11px] text-muted-foreground mt-1.5">
              Exemplo: 5579988887766 → 55 (Brasil) + 79 (SE) + número
            </p>
          </Field>
          {waSaved && (
            <p className="font-body text-xs text-green-600">✓ Número salvo com sucesso!</p>
          )}
          <button
            onClick={handleSaveWa}
            className="bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Número
          </button>
        </div>

        {/* Senha */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground">Alterar Senha</h3>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Senha de acesso a este painel
            </p>
          </div>
          <Field label="Senha Atual">
            <input
              type="password"
              value={oldPw}
              onChange={(e) => { setOldPw(e.target.value); setPwMsg(null) }}
              className={inputCls}
            />
          </Field>
          <Field label="Nova Senha">
            <input
              type="password"
              value={newPw}
              onChange={(e) => { setNewPw(e.target.value); setPwMsg(null) }}
              className={inputCls}
            />
          </Field>
          {pwMsg && (
            <p className={`font-body text-xs ${pwMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
              {pwMsg.text}
            </p>
          )}
          <button
            onClick={handleChangePw}
            disabled={!oldPw || !newPw}
            className="bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Atualizar Senha
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DASHBOARD SHELL ───────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [products, setProducts] = useState<Product[]>(getProducts)
  const [settings, setSettings] = useState<SiteSettings>(getSettings)

  const updateProducts = (p: Product[]) => { setProducts(p); saveProducts(p) }
  const updateSettings = (s: SiteSettings) => { setSettings(s); saveSettings(s) }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar tab={tab} setTab={setTab} onLogout={onLogout} />

      {/* Main */}
      <main className="ml-52 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {tab === 'dashboard' && <DashboardTab products={products} />}
          {tab === 'products' && (
            <ProductsTab products={products} onUpdate={updateProducts} />
          )}
          {tab === 'banner' && (
            <BannerTab settings={settings} onUpdate={updateSettings} />
          )}
          {tab === 'settings' && (
            <SettingsTab settings={settings} onUpdate={updateSettings} />
          )}
        </div>
      </main>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(getAdminSession)

  const handleLogout = () => {
    clearAdminSession()
    setLoggedIn(false)
  }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />
  return <AdminDashboard onLogout={handleLogout} />
}

export default Admin
