import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Customer {
  name: string
  phone: string
  email: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  cep: string
}

export const EMPTY_CUSTOMER: Customer = {
  name: '', phone: '', email: '',
  street: '', number: '', neighborhood: '',
  city: '', state: '', cep: '',
}

interface CustomerContextType {
  customer: Customer | null
  isLoggedIn: boolean
  save: (c: Customer) => void
  logout: () => void
}

const CustomerContext = createContext<CustomerContextType | null>(null)

const KEY = 'lourds_customer'

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const save = (c: Customer) => {
    setCustomer(c)
    localStorage.setItem(KEY, JSON.stringify(c))
  }

  const logout = () => {
    setCustomer(null)
    localStorage.removeItem(KEY)
  }

  return (
    <CustomerContext.Provider value={{ customer, isLoggedIn: !!customer, save, logout }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomer must be inside CustomerProvider')
  return ctx
}
