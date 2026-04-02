import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Maximize, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Propiedad no encontrada</p>
        <Link to="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <Link to="/#propiedades" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Volver a propiedades
        </Link>

        {property.image_url && (
          <div className="rounded-lg overflow-hidden mb-8 aspect-video">
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-sm mb-3">
              {property.property_type}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{property.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin size={18} /> {property.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize size={18} /> {property.hectares} hectáreas
            </span>
          </div>

          <p className="text-3xl font-bold text-accent">{property.price}</p>

          {property.description && (
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-semibold text-foreground mb-3">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
