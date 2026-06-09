import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Mensaje enviado", description: "Nos pondremos en contacto contigo pronto." });
      setForm({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <section id="contacto" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contáctanos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            ¿Interesado en alguna propiedad o quieres vender tu campo? janos tus datos y te contactaremos a la brevedad.
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                required
                className="pl-10 bg-background"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                className="pl-10 bg-background"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                name="phone"
                type="tel"
                placeholder="Teléfono"
                value={form.phone}
                onChange={handleChange}
                className="pl-10 bg-background"
              />
            </div>
            <Textarea
              name="message"
              placeholder="Cuéntanos qué buscas o qué propiedad deseas vender..."
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="bg-background"
            />
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <Send className="mr-2 h-5 w-5" />
              {loading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
