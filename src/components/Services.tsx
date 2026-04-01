import { Search, Handshake, TrendingUp, Shield } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Búsqueda Especializada",
    description: "Encontramos la propiedad agrícola ideal según tus necesidades productivas y de inversión.",
  },
  {
    icon: TrendingUp,
    title: "Tasación y Valorización",
    description: "Evaluación profesional del valor productivo, suelos, derechos de agua y potencial de la tierra.",
  },
  {
    icon: Handshake,
    title: "Intermediación y Negociación",
    description: "Acompañamiento integral en todo el proceso de compraventa con total transparencia.",
  },
  {
    icon: Shield,
    title: "Asesoría Legal",
    description: "Revisión de títulos, estudios de dominio y regularización de propiedades rurales.",
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            Experiencia y dedicación en cada etapa de la compraventa de propiedades agrícolas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-card rounded-lg p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <s.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground font-sans">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
