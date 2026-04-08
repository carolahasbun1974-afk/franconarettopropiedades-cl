import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyImageGalleryProps {
  images: { id: string; image_url: string; position: number }[];
  fallbackUrl?: string | null;
}

const PropertyImageGallery = ({ images, fallbackUrl }: PropertyImageGalleryProps) => {
  const [current, setCurrent] = useState(0);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  if (sorted.length === 0 && !fallbackUrl) return null;
  if (sorted.length === 0 && fallbackUrl) {
    return (
      <div className="rounded-lg overflow-hidden mb-8 aspect-video">
        <img src={fallbackUrl} alt="Propiedad" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-3">
      <div className="relative rounded-lg overflow-hidden bg-muted flex items-start justify-center" style={{ maxHeight: '70vh' }}>
        <img
          src={sorted[current].image_url}
          alt={`Foto ${current + 1}`}
          className="w-full h-auto max-h-[70vh] object-contain object-top"
        />
        {sorted.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 rounded-full"
              onClick={() => setCurrent((p) => (p === 0 ? sorted.length - 1 : p - 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 rounded-full"
              onClick={() => setCurrent((p) => (p === sorted.length - 1 ? 0 : p + 1))}
            >
              <ChevronRight size={20} />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === current ? "bg-primary" : "bg-background/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrent(i)}
              className={cn(
                "shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors",
                i === current ? "border-primary" : "border-transparent"
              )}
            >
              <img src={img.image_url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
