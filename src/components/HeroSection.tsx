const HeroSection = () => {
  return (
    <section className="relative h-[92vh] min-h-[620px] overflow-hidden">
      <img
        src="https://lourd-pajama-catalog.lovable.app/assets/hero-pajama-CnBE3rq5.jpg"
        alt="Coleção de pijamas Loja Lourds"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/45 to-foreground/10" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-xl animate-fade-in">
            <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
              Nova Coleção 2026
            </p>
            <h1 className="font-heading text-5xl md:text-7xl font-semibold text-secondary leading-tight mb-6">
              Conforto que
              <br />
              <span className="italic">encanta</span>
            </h1>
            <p className="font-body text-base text-secondary/75 mb-10 max-w-md leading-relaxed">
              Descubra nossa coleção exclusiva de pijamas — feitos com tecidos premium para suas
              noites mais especiais.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#catalogo"
                className="inline-block bg-accent text-accent-foreground font-body text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:opacity-90 transition-opacity"
              >
                Ver Catálogo
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-secondary/50 text-secondary font-body text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:border-secondary hover:bg-secondary/10 transition-all"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
