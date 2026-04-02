import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Propiedades", href: "/#propiedades" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Logo area */}
      <div className="bg-primary flex justify-center py-6">
        <a href="/#inicio" className="inline-block bg-background rounded-sm px-6 py-4">
          <img src={logo} alt="Franco Naretto Propiedades Agrícolas" className="h-20" />
        </a>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex justify-center gap-10 pb-4">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden flex justify-center pb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary pb-4">
          <ul className="flex flex-col items-center gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
