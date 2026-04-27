import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "./PropertyCard";
import vineyardImg from "@/assets/property-vineyard.jpg";
import wheatImg from "@/assets/property-wheat.jpg";
import orchardImg from "@/assets/property-orchard.jpg";
import { PROPERTY_CATEGORIES } from "@/lib/propertyCategories";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const fallbackProperties = [
  {
    id: "fallback-1",
    image: vineyardImg,
    title: "Viñedo Premium Valle Central",
    location: "Valle del Maule",
    hectares: 120,
    property_type: "Fundos y parcelas agrícolas",
    price: "UF 85.000",
  },
  {
    id: "fallback-2",
    image: wheatImg,
    title: "Campo de Cereales Los Andes",
    location: "Región del Biobío",
    hectares: 350,
    property_type: "Fundos y parcelas agrícolas",
    price: "UF 45.000",
  },
  {
    id: "fallback-3",
    image: orchardImg,
    title: "Frutales del Sur",
    location: "Región de la Araucanía",
    hectares: 80,
    property_type: "Fundos y parcelas agrícolas",
    price: "UF 62.000",
  },
];

const FeaturedProperties = () => {
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const location = useLocation();

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("cat");
  }, [location.search]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDbProperties(data);
    };
    fetchProperties();
  }, []);

  const hasDbProperties = dbProperties.length > 0;

  const filteredDb = activeCategory
    ? dbProperties.filter((p) => p.property_type === activeCategory)
    : dbProperties.slice(0, 6);

  const filteredFallback = activeCategory
    ? fallbackProperties.filter((p) => p.property_type === activeCategory)
    : fallbackProperties;

  const setCategory = (cat: string | null) => {
    const url = cat ? `/?cat=${encodeURIComponent(cat)}#propiedades` : "/#propiedades";
    window.location.href = url;
  };

  return (
    <section id="propiedades" className="py-20 bg-background scroll-mt-40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {activeCategory ?? "Propiedades Destacadas"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            {activeCategory
              ? `Mostrando propiedades en la categoría "${activeCategory}".`
              : "Selección exclusiva de las mejores tierras agrícolas disponibles en el mercado."}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            Todas
          </button>
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {hasDbProperties && filteredDb.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No hay propiedades en esta categoría todavía.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hasDbProperties
            ? filteredDb.map((prop) => (
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
            : filteredFallback.map((prop) => (
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
