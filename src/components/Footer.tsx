import { Instagram, Phone, Mail } from 'lucide-react'

interface FooterProps {
  whatsapp: string
}

const Footer = ({ whatsapp }: FooterProps) => {
  return (
    <footer className="bg-foreground text-secondary/80 py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Marca */}
          <div>
            <h3 className="font-heading text-3xl font-bold text-secondary mb-4">LOURDS</h3>
            <p className="font-body text-sm leading-relaxed">
              Pijamas feitos com carinho e tecidos premium para toda a família.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-secondary mb-4">
              Navegação
            </h4>
            <div className="space-y-2">
              {['Feminino', 'Masculino', 'Infantil', 'Novidades', 'Sobre nós'].map((item) => (
                <a
                  key={item}
                  href="#catalogo"
                  className="block font-body text-sm hover:text-secondary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-secondary mb-4">
              Contato
            </h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/lojalourds"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-body text-sm hover:text-secondary transition-colors"
              >
                <Instagram size={16} /> @lojalourds
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-body text-sm hover:text-secondary transition-colors"
              >
                <Phone size={16} /> WhatsApp
              </a>
              <a
                href="mailto:contato@lojalourds.com"
                className="flex items-center gap-3 font-body text-sm hover:text-secondary transition-colors"
              >
                <Mail size={16} /> contato@lojalourds.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/10 pt-8">
          <p className="font-body text-xs text-center text-secondary/50">
            © 2026 Loja Lourds. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
