import PropertyCard from "./PropertyCard";
import vineyardImg from "@/assets/property-vineyard.jpg";
import wheatImg from "@/assets/property-wheat.jpg";
import orchardImg from "@/assets/property-orchard.jpg";

const properties = [
  {
    image: vineyardImg,
    title: "Viñedo Premium Valle Central",
    location: "Valle del Maule",
    hectares: 120,
    type: "Viñedo",
    price: "UF 85.000",
  },
  {
    image: wheatImg,
    title: "Campo de Cereales Los Andes",
    location: "Región del Biobío",
    hectares: 350,
    type: "Cultivo",
    price: "UF 45.000",
  },
  {
    image: orchardImg,
    title: "Frutales del Sur",
    location: "Región de la Araucanía",
    hectares: 80,
    type: "Frutícola",
    price: "UF 62.000",
  },
];

const FeaturedProperties = () => {
  return (
    <section id="propiedades" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Propiedades Destacadas
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            Selección exclusiva de las mejores tierras agrícolas disponibles en el mercado.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard key={prop.title} {...prop} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
