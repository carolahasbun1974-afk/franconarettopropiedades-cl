import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyImage = Database["public"]["Tables"]["property_images"]["Row"];

const Admin = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyImages, setPropertyImages] = useState<Record<string, PropertyImage[]>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    hectares: "",
    location: "",
    property_type: "Agrícola",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth");
      else setUserId(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userId) fetchProperties();
  }, [userId]);

  const fetchProperties = async () => {
    const { data: props } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (!props) return;
    setProperties(props);
    const { data: imgs } = await supabase.from("property_images").select("*").order("position");
    const grouped: Record<string, PropertyImage[]> = {};
    (imgs || []).forEach((img) => {
      if (!grouped[img.property_id]) grouped[img.property_id] = [];
      grouped[img.property_id].push(img);
    });
    setPropertyImages(grouped);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    const ext = file.name.split(".").pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file);
    if (error) {
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      hectares: parseFloat(form.hectares),
      location: form.location,
      property_type: form.property_type,
      image_url: editing?.image_url || null,
      user_id: userId,
    };

    let propertyId = editing?.id;
    let error;

    if (editing) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", editing.id));
    } else {
      const res = await supabase.from("properties").insert(payload).select("id").single();
      error = res.error;
      propertyId = res.data?.id;
    }

    if (error) {
      setLoading(false);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Delete removed images
    if (imagesToDelete.length > 0) {
      await supabase.from("property_images").delete().in("id", imagesToDelete);
    }

    // Upload new images
    if (propertyId && imageFiles.length > 0) {
      const startPos = existingImages.filter((img) => !imagesToDelete.includes(img.id)).length;
      for (let i = 0; i < imageFiles.length; i++) {
        const url = await uploadImage(imageFiles[i]);
        if (url) {
          await supabase.from("property_images").insert({
            property_id: propertyId,
            image_url: url,
            position: startPos + i,
          });
        }
      }
      // Update main image_url to first image
      const { data: firstImg } = await supabase
        .from("property_images")
        .select("image_url")
        .eq("property_id", propertyId)
        .order("position")
        .limit(1)
        .single();
      if (firstImg) {
        await supabase.from("properties").update({ image_url: firstImg.image_url }).eq("id", propertyId);
      }
    }

    setLoading(false);
    toast({ title: editing ? "Propiedad actualizada" : "Propiedad creada" });
    resetForm();
    fetchProperties();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchProperties();
  };

  const startEdit = (prop: Property) => {
    setEditing(prop);
    setForm({
      title: prop.title,
      description: prop.description || "",
      price: prop.price,
      hectares: String(prop.hectares),
      location: prop.location,
      property_type: prop.property_type,
    });
    setExistingImages(propertyImages[prop.id] || []);
    setImagesToDelete([]);
    setShowForm(true);
    setImageFiles([]);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setImageFiles([]);
    setExistingImages([]);
    setImagesToDelete([]);
    setForm({ title: "", description: "", price: "", hectares: "", location: "", property_type: "Agrícola" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleDeleteImage = (id: string) => {
    setImagesToDelete((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>Ver sitio</Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-1" /> Salir
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            <Plus size={16} className="mr-1" /> Nueva Propiedad
          </Button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border mb-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editing ? "Editar Propiedad" : "Nueva Propiedad"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Precio (ej: UF 85.000)</Label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Hectáreas</Label>
                <Input type="number" step="0.1" value={form.hectares} onChange={(e) => setForm({ ...form, hectares: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Propiedad</Label>
                <Input value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Agregar Imágenes</Label>
                <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
              </div>
            </div>

            {/* Existing images when editing */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <Label>Imágenes actuales</Label>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative w-24 h-16 rounded overflow-hidden border border-border group">
                      <img src={img.image_url} alt="" className={`w-full h-full object-cover ${imagesToDelete.includes(img.id) ? "opacity-30" : ""}`} />
                      <button
                        type="button"
                        onClick={() => toggleDeleteImage(img.id)}
                        className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                {imagesToDelete.length > 0 && (
                  <p className="text-xs text-destructive">{imagesToDelete.length} imagen(es) se eliminarán al guardar</p>
                )}
              </div>
            )}

            {/* New files preview */}
            {imageFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Nuevas imágenes ({imageFiles.length})</Label>
                <div className="flex gap-2 flex-wrap">
                  {imageFiles.map((f, i) => (
                    <div key={i} className="w-24 h-16 rounded overflow-hidden border border-border">
                      <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : editing ? "Actualizar" : "Crear"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {properties.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No hay propiedades aún. ¡Crea la primera!</p>
          )}
          {properties.map((prop) => {
            const imgs = propertyImages[prop.id] || [];
            const thumb = imgs[0]?.image_url || prop.image_url;
            return (
              <div key={prop.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center">
                {thumb && <img src={thumb} alt={prop.title} className="w-20 h-20 object-cover rounded" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {prop.location} · {prop.hectares} ha · {prop.price}
                    {imgs.length > 0 && ` · ${imgs.length} foto${imgs.length > 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(prop)}><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(prop.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Admin;
