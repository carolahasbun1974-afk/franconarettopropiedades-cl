const About = () => {
  return (
    <section id="nosotros" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Sobre CampoReal
          </h2>
          <p className="text-muted-foreground font-sans leading-relaxed mb-6">
            Con más de 15 años de experiencia en el mercado de propiedades agrícolas, 
            CampoReal se ha consolidado como la corredora líder en intermediación de tierras 
            productivas. Nuestro equipo de profesionales conoce cada valle, cada tipo de suelo 
            y cada oportunidad que el campo tiene para ofrecer.
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed">
            Trabajamos con viñedos, frutales, cultivos extensivos, ganadería y proyectos 
            forestales, conectando a propietarios e inversionistas con transparencia, 
            profesionalismo y un profundo conocimiento del mundo agrícola.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground font-sans mt-1">Propiedades vendidas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground font-sans mt-1">Años de experiencia</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground font-sans mt-1">Hectáreas transadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
