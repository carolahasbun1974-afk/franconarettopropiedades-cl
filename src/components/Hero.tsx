import heroImage from "@/assets/hero-farm.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-40">
      <img
        src={heroImage}
        alt="Campos agrícolas al atardecer"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 container mx-auto text-center px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in-up font-sans tracking-tight">
          Especialistas en Propiedades Agrícolas
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-10 font-sans opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Conectamos inversionistas con las mejores tierras productivas del país.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6">
            <a href="#propiedades">Ver Propiedades</a>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 text-base px-8 py-6">
            <a href="#contacto">Contáctanos</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
