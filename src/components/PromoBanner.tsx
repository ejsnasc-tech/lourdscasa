import { X } from 'lucide-react'
import { useState } from 'react'
import type { SiteSettings } from '@/store'

interface PromoBannerProps {
  settings: SiteSettings
}

const PromoBanner = ({ settings }: PromoBannerProps) => {
  const [dismissed, setDismissed] = useState(false)

  if (!settings.bannerActive || dismissed) return null

  return (
    <div className="relative bg-accent text-accent-foreground py-2.5 px-10 text-center z-50">
      <p className="font-body text-xs uppercase tracking-widest">{settings.bannerText}</p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fechar banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default PromoBanner
