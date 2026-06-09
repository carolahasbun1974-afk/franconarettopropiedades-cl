import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="inline-flex mb-4 rounded-md bg-background px-3 py-2 shadow-sm">
              <img src={logo} alt="Franco Naretto Propiedades Agrícolas" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-primary-foreground/75 font-sans text-sm leading-relaxed">
              Corredora de propiedades agrícolas. Conectamos a quienes buscan invertir en el campo con las mejores oportunidades del mercado.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 font-sans text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +56 9 98859247
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="break-all">contacto@franconarettopropiedades.cl</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Rengo, VI Región
              </li>
              <li>
                <a
                  href="https://instagram.com/franconaretto.propiedades"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-foreground transition-colors"
                >
                  <Instagram size={16} /> @franconaretto.propiedades
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">¿Tienes un campo para vender?</h4>
            <p className="text-primary-foreground/75 font-sans text-sm mb-4">
              janos tus datos y te contactaremos a la brevedad.
            </p>
            <Button variant="secondary" className="font-sans">
              Publicar mi propiedad
            </Button>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-6 text-center text-xs text-primary-foreground/50 font-sans">
          © 2026 Franco Naretto Propiedades Agrícolas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
