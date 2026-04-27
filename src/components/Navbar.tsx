import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { PROPERTY_CATEGORIES } from "@/lib/propertyCategories";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [propsMenuOpen, setPropsMenuOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);

  const links = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Propiedades", href: "/#propiedades", hasDropdown: true },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  const categoryHref = (cat: string) =>
    `/?cat=${encodeURIComponent(cat)}#propiedades`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Logo area */}
      <div className="bg-primary flex justify-center py-6">
        <a href="/#inicio" className="inline-block bg-background rounded-sm px-6 py-4">
          <img src={logo} alt="Franco Naretto Propiedades Agrícolas" className="h-20" />
        </a>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex justify-center gap-10 pb-4 pt-4 bg-primary-dark">
        {links.map((l) =>
          l.hasDropdown ? (
            <div
              key={l.href}
              className="relative"
              onMouseEnter={() => setPropsMenuOpen(true)}
              onMouseLeave={() => setPropsMenuOpen(false)}
            >
              <a
                href={l.href}
                className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide flex items-center gap-1"
              >
                {l.label}
                <ChevronDown size={14} />
              </a>
              {propsMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                  <ul className="bg-primary-dark border border-primary-foreground/10 rounded-md shadow-lg py-2 min-w-[260px]">
                    {PROPERTY_CATEGORIES.map((cat) => (
                      <li key={cat}>
                        <a
                          href={categoryHref(cat)}
                          className="block px-4 py-2 text-sm text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary/40 transition-colors whitespace-nowrap"
                        >
                          {cat}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide"
            >
              {l.label}
            </a>
          ),
        )}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden bg-primary-dark flex justify-center py-3">
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
            {links.map((l) =>
              l.hasDropdown ? (
                <li key={l.href} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setMobilePropsOpen(!mobilePropsOpen)}
                    className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide flex items-center gap-1"
                  >
                    {l.label}
                    <ChevronDown size={14} className={mobilePropsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                  {mobilePropsOpen && (
                    <ul className="flex flex-col items-center gap-2 pb-2">
                      {PROPERTY_CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <a
                            href={categoryHref(cat)}
                            onClick={() => { setIsOpen(false); setMobilePropsOpen(false); }}
                            className="text-xs text-primary-foreground/75 hover:text-primary-foreground"
                          >
                            {cat}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold text-primary-foreground/85 hover:text-primary-foreground transition-colors tracking-wide"
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
