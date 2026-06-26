import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PROPERTY_CATEGORIES } from "@/lib/propertyCategories";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

const initial = {
  name: "",
  email: "",
  phone: "",
  propertyType: "",
  location: "",
  region: "",
  hectares: "",
  price: "",
  hasWater: "",
  hasElectricity: "",
  hasAccess: "",
  description: "",
};

const SellProperty = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof typeof initial, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "sell-property-notification",
          idempotencyKey: `sell-${Date.now()}-${form.email}`,
          templateData: form,
        },
      });
      if (error) throw error;
      toast({
        title: "Solicitud enviada",
        description: "Te contactaremos a la brevedad para coordinar la publicación.",
      });
      setForm(initial);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al enviar",
        description:
          "Intenta nuevamente o escríbenos a contacto@franconarettopropiedades.cl",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-40 pb-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          {submitted ? (
            <div className="bg-background rounded-lg shadow-sm p-10 md:p-14 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="h-9 w-9 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¡Solicitud recibida!
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Gracias por confiar en nosotros. Hemos recibido los datos de tu propiedad
                y nuestro equipo te contactará a la brevedad para coordinar los siguientes pasos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">Volver al inicio</Link>
                </Button>
                <Button onClick={() => setSubmitted(false)}>
                  Enviar otra propiedad
                </Button>
              </div>
            </div>
          ) : (
          <div className="bg-background rounded-lg shadow-sm p-8 md:p-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Publica tu propiedad
            </h1>
            <p className="text-muted-foreground mb-8">
              Completa los datos de tu campo o terreno. Nuestro equipo te
              contactará para coordinar la publicación y visita.
            </p>


            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Tus datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Datos de la propiedad</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de propiedad *</Label>
                    <Select
                      value={form.propertyType}
                      onValueChange={(v) => update("propertyType", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hectares">Hectáreas / Superficie</Label>
                    <Input
                      id="hectares"
                      placeholder="Ej: 25 ha o 5.000 m²"
                      value={form.hectares}
                      onChange={(e) => update("hectares", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Comuna / Localidad *</Label>
                    <Input
                      id="location"
                      required
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Región</Label>
                    <Input
                      id="region"
                      placeholder="Ej: VI Región"
                      value={form.region}
                      onChange={(e) => update("region", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio estimado</Label>
                    <Input
                      id="price"
                      placeholder="UF, CLP o USD"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="water">Derechos de agua</Label>
                    <Input
                      id="water"
                      placeholder="Sí / No / Detalle"
                      value={form.hasWater}
                      onChange={(e) => update("hasWater", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="electricity">Electricidad</Label>
                    <Input
                      id="electricity"
                      placeholder="Sí / No"
                      value={form.hasElectricity}
                      onChange={(e) => update("hasElectricity", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="access">Acceso / Camino</Label>
                    <Input
                      id="access"
                      placeholder="Pavimentado, ripio, etc."
                      value={form.hasAccess}
                      onChange={(e) => update("hasAccess", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descripción adicional</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Cuéntanos más sobre la propiedad: cultivos, infraestructura, casas, etc."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </div>
              </section>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <Send className="mr-2 h-5 w-5" />
                {loading ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellProperty;
