import { products as defaultProducts } from './data/products'
import type { Product } from './data/products'

const PRODUCTS_KEY = 'lourds_products'
const SETTINGS_KEY = 'lourds_settings'
const SESSION_KEY = 'lourds_admin_session'
const PW_KEY = 'lourds_admin_pw'

export interface SiteSettings {
  whatsapp: string
  bannerActive: boolean
  bannerText: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: '5579998556435',
  bannerActive: false,
  bannerText: '✨ Frete grátis acima de R$ 299 · Entrega em todo o Brasil',
}

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return defaultProducts
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts
  } catch {
    return defaultProducts
  }
}

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const checkAdminPassword = (password: string): boolean => {
  const stored = localStorage.getItem(PW_KEY) ?? 'lourds2026'
  return password === stored
}

export const setAdminPassword = (newPw: string) => {
  localStorage.setItem(PW_KEY, newPw)
}

export const getAdminSession = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export const setAdminSession = () => {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export const clearAdminSession = () => {
  sessionStorage.removeItem(SESSION_KEY)
}
