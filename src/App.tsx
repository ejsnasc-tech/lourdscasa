import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Admin from './pages/Admin'
import { CartProvider } from './context/CartContext'
import { CustomerProvider } from './context/CustomerContext'

function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CustomerProvider>
  )
}

export default App
