import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import { MapPin, Maximize, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyImage = Database["public"]["Tables"]["property_images"]["Row"];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const [propRes, imgRes] = await Promise.all([
        supabase.from("properties").select("*").eq("id", id).single(),
        supabase.from("property_images").select("*").eq("property_id", id).order("position"),
      ]);
      setProperty(propRes.data);
      setImages(imgRes.data || []);
      setLoading(false);
    };
    fetchData();
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
      <main className="container mx-auto px-4 pt-56 pb-24 max-w-4xl">
        <Link to="/#propiedades" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Volver a propiedades
        </Link>

        <PropertyImageGallery images={images} fallbackUrl={property.image_url} />

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
              <h2 className="text-xl font-semibold mb-3 text-primary">Descripción</h2>
              <p className="leading-relaxed whitespace-pre-line text-primary">{property.description}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
