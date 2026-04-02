import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "./PropertyCard";
import vineyardImg from "@/assets/property-vineyard.jpg";
import wheatImg from "@/assets/property-wheat.jpg";
import orchardImg from "@/assets/property-orchard.jpg";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const fallbackProperties = [
  {
    id: "fallback-1",
    image: vineyardImg,
    title: "Viñedo Premium Valle Central",
    location: "Valle del Maule",
    hectares: 120,
    property_type: "Viñedo",
    price: "UF 85.000",
  },
  {
    id: "fallback-2",
    image: wheatImg,
    title: "Campo de Cereales Los Andes",
    location: "Región del Biobío",
    hectares: 350,
    property_type: "Cultivo",
    price: "UF 45.000",
  },
  {
    id: "fallback-3",
    image: orchardImg,
    title: "Frutales del Sur",
    location: "Región de la Araucanía",
    hectares: 80,
    property_type: "Frutícola",
    price: "UF 62.000",
  },
];

const FeaturedProperties = () => {
  const [dbProperties, setDbProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setDbProperties(data);
    };
    fetchProperties();
  }, []);

  const hasDbProperties = dbProperties.length > 0;

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
          {hasDbProperties
            ? dbProperties.map((prop) => (
                <Link key={prop.id} to={`/propiedad/${prop.id}`}>
                  <PropertyCard
                    image={prop.image_url || vineyardImg}
                    title={prop.title}
                    location={prop.location}
                    hectares={prop.hectares}
                    type={prop.property_type}
                    price={prop.price}
                  />
                </Link>
              ))
            : fallbackProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  image={prop.image}
                  title={prop.title}
                  location={prop.location}
                  hectares={prop.hectares}
                  type={prop.property_type}
                  price={prop.price}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
