import { useState } from 'react'
import { X, CheckCircle, User, LogOut, ChevronRight } from 'lucide-react'
import { useCart, parseBRL } from '@/context/CartContext'
import { useCustomer, type Customer, EMPTY_CUSTOMER } from '@/context/CustomerContext'
import { getSettings } from '@/store'

interface CheckoutModalProps {
  onClose: () => void
  onSuccess: () => void
}

const fmt = (n: number) =>
  'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const inputCls =
  'w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent transition-colors font-body placeholder:text-muted-foreground/50'

const Field = ({
  label, children, half,
}: {
  label: string
  children: React.ReactNode
  half?: boolean
}) => (
  <div className={half ? '' : 'col-span-2'}>
    <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">
      {label}
    </label>
    {children}
  </div>
)

type Step = 'account' | 'form' | 'summary'

const CheckoutModal = ({ onClose, onSuccess }: CheckoutModalProps) => {
  const { items, total } = useCart()
  const { customer, isLoggedIn, save, logout } = useCustomer()
  const { whatsapp } = getSettings()

  // If already logged in, go directly to summary
  const [step, setStep] = useState<Step>(isLoggedIn ? 'summary' : 'account')
  const [form, setForm] = useState<Customer>(customer ?? EMPTY_CUSTOMER)
  const [saveAccount, setSaveAccount] = useState(true)
  const [done, setDone] = useState(false)

  const set = (k: keyof Customer, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const canProceed =
    form.name.trim() &&
    form.phone.trim() &&
    form.street.trim() &&
    form.number.trim() &&
    form.city.trim()

  const handleConfirm = () => {
    if (saveAccount) save(form)

    // Build WhatsApp message
    const lines: string[] = ['Olá! Gostaria de fazer um pedido na *Lourds*:\n']
    lines.push('📦 *Itens:*')
    items.forEach((item) => {
      const sub = fmt(parseBRL(item.price) * item.qty)
      lines.push(
        `• ${item.qty}x ${item.name}${item.size ? ` (${item.size})` : ''} — ${sub}`,
      )
    })
    lines.push(`\n💰 *Total: ${fmt(total)}*`)
    lines.push('\n👤 *Meus dados:*')
    lines.push(`Nome: ${form.name}`)
    lines.push(`Telefone: ${form.phone}`)
    if (form.email) lines.push(`E-mail: ${form.email}`)
    lines.push(
      `Endereço: ${form.street}, ${form.number}${form.neighborhood ? ` - ${form.neighborhood}` : ''}`,
    )
    if (form.cep) lines.push(`CEP: ${form.cep}`)
    lines.push(`Cidade: ${form.city}${form.state ? ` - ${form.state}` : ''}`)

    const msg = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer')

    setDone(true)
    setTimeout(onSuccess, 2000)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl my-4 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* ── DONE ── */}
        {done && (
          <div className="px-8 py-16 flex flex-col items-center text-center gap-4">
            <CheckCircle size={56} className="text-green-500" />
            <h3 className="font-heading text-2xl font-semibold text-foreground">Pedido enviado!</h3>
            <p className="font-body text-sm text-muted-foreground max-w-xs">
              O WhatsApp da Lourds foi aberto com seu pedido. Em breve entraremos em contato!
            </p>
          </div>
        )}

        {/* ── STEP: ACCOUNT CHOICE ── */}
        {!done && step === 'account' && (
          <div className="px-6 py-6">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-1">
              Finalizar Pedido
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Para prosseguir, identifique-se ou continue como visitante.
            </p>

            {/* Logged-in shortcut (shouldn't appear, but safety) */}
            <div className="space-y-3">
              <button
                onClick={() => setStep('form')}
                className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-accent transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                    <User size={16} className="text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-body text-sm font-semibold text-foreground">
                      Criar conta / Preencher dados
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      Salve seus dados para próximas compras
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </button>

              <button
                onClick={() => { setSaveAccount(false); setStep('form') }}
                className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-border/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-body text-sm font-semibold text-foreground">
                      Continuar como visitante
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      Preencha seus dados sem salvar
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: FORM ── */}
        {!done && step === 'form' && (
          <div>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <h3 className="font-heading text-xl font-semibold text-foreground">Seus Dados</h3>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Esses dados serão incluídos no pedido enviado pelo WhatsApp
              </p>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Dados pessoais */}
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent">
                Dados Pessoais
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome Completo *">
                  <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Seu nome" className={inputCls} />
                </Field>
                <Field label="Telefone / WhatsApp *" half>
                  <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(79) 99999-9999" className={inputCls} />
                </Field>
                <Field label="E-mail">
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="seu@email.com" className={inputCls} />
                </Field>
              </div>

              {/* Endereço */}
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent pt-2">
                Endereço de Entrega
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rua / Avenida *">
                  <input type="text" value={form.street} onChange={(e) => set('street', e.target.value)} placeholder="Rua das Flores" className={inputCls} />
                </Field>
                <Field label="Número *" half>
                  <input type="text" value={form.number} onChange={(e) => set('number', e.target.value)} placeholder="123" className={inputCls} />
                </Field>
                <Field label="Bairro" half>
                  <input type="text" value={form.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} placeholder="Centro" className={inputCls} />
                </Field>
                <Field label="CEP" half>
                  <input type="text" value={form.cep} onChange={(e) => set('cep', e.target.value)} placeholder="49000-000" maxLength={9} className={inputCls} />
                </Field>
                <Field label="Cidade *" half>
                  <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Aracaju" className={inputCls} />
                </Field>
                <Field label="Estado" half>
                  <input type="text" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="SE" maxLength={2} className={inputCls} />
                </Field>
              </div>

              {/* Save account toggle */}
              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <div
                  onClick={() => setSaveAccount((s) => !s)}
                  className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                    saveAccount ? 'bg-accent' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      saveAccount ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="font-body text-sm text-foreground">
                  Salvar meus dados para próximas compras
                </span>
              </label>
            </div>

            <div className="flex gap-3 px-6 pb-6 border-t border-border pt-4">
              <button
                onClick={() => setStep('account')}
                className="flex-1 border border-border text-muted-foreground font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:text-foreground transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep('summary')}
                disabled={!canProceed}
                className="flex-1 bg-accent text-accent-foreground font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Revisar Pedido
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: SUMMARY ── */}
        {!done && step === 'summary' && (
          <div>
            <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground">Revisar Pedido</h3>
                <p className="font-body text-xs text-muted-foreground mt-0.5">Confirme antes de enviar</p>
              </div>
              {isLoggedIn && (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <LogOut size={12} /> Sair
                </button>
              )}
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Customer info */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                    Seus Dados
                  </p>
                  <button
                    onClick={() => setStep('form')}
                    className="font-body text-xs text-accent hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-0.5 font-body text-sm text-foreground">
                  <p className="font-semibold">{form.name}</p>
                  <p className="text-muted-foreground">{form.phone}</p>
                  {form.email && <p className="text-muted-foreground">{form.email}</p>}
                  <p className="text-muted-foreground">
                    {form.street}, {form.number}
                    {form.neighborhood ? ` — ${form.neighborhood}` : ''}
                  </p>
                  <p className="text-muted-foreground">
                    {form.city}{form.state ? ` - ${form.state}` : ''}
                    {form.cep ? ` · CEP ${form.cep}` : ''}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Itens do Pedido
                </p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {item.qty}x{item.size ? ` · ${item.size}` : ''}
                        </p>
                      </div>
                      <p className="font-body text-sm font-semibold text-foreground flex-shrink-0">
                        {fmt(parseBRL(item.price) * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-body text-sm text-muted-foreground">Total</span>
                <span className="font-heading text-2xl font-semibold text-foreground">
                  {fmt(total)}
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg px-4 py-3">
                <p className="font-body text-xs text-muted-foreground text-center">
                  Ao confirmar, o WhatsApp da Lourds será aberto com seu pedido formatado. O frete será combinado na conversa.
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6 border-t border-border pt-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-border text-muted-foreground font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:text-foreground transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-[#25D366] text-white font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-[#1fba5a] transition-colors flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Confirmar e Abrir WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
