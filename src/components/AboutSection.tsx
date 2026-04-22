const features = [
  {
    icon: '✦',
    title: 'Tecidos Premium',
    description:
      'Selecionamos os melhores tecidos — algodão egípcio, modal e fleece antialérgico — para garantir maciez e durabilidade em cada peça.',
  },
  {
    icon: '♡',
    title: 'Feito com Carinho',
    description:
      'Cada pijama é pensado nos detalhes: acabamento refinado, costuras reforçadas e design exclusivo para toda a família dormir bem.',
  },
  {
    icon: '◈',
    title: 'Entrega em Todo Brasil',
    description:
      'Enviamos para todo o território nacional com embalagem especial e rastreamento em tempo real. Seu pedido chega com cuidado.',
  },
]

const AboutSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Por que a Lourds?
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground">
            O conforto que você{' '}
            <span className="italic">merece</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="text-center group">
              <div className="text-3xl text-accent mb-5 transition-transform duration-300 group-hover:scale-110 inline-block">
                {icon}
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
