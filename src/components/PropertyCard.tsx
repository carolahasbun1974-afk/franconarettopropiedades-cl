import { MapPin, Maximize } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  hectares: number;
  type: string;
  price: string;
}

const PropertyCard = ({ image, title, location, hectares, type, price }: PropertyCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={800}
          height={600}
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-sm">
          {type}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {location}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={14} /> {hectares} ha
          </span>
        </div>
        <p className="text-xl font-bold text-accent">{price}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
