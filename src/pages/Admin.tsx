import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const Admin = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      if (!session) {
        navigate("/auth");
        return;
      }
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
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProperties(data);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
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

    let image_url = editing?.image_url || null;
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      hectares: parseFloat(form.hectares),
      location: form.location,
      property_type: form.property_type,
      image_url,
      user_id: userId,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("properties").insert(payload));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Propiedad actualizada" : "Propiedad creada" });
      resetForm();
      fetchProperties();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchProperties();
    }
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
    setShowForm(true);
    setImageFile(null);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setImageFile(null);
    setForm({ title: "", description: "", price: "", hectares: "", location: "", property_type: "Agrícola" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Ver sitio
          </Button>
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
                <Label>Imagen</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {editing?.image_url && !imageFile && (
                  <p className="text-xs text-muted-foreground">Imagen actual conservada. Sube otra para reemplazar.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : editing ? "Actualizar" : "Crear"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {properties.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No hay propiedades aún. ¡Crea la primera!</p>
          )}
          {properties.map((prop) => (
            <div key={prop.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center">
              {prop.image_url && (
                <img src={prop.image_url} alt={prop.title} className="w-20 h-20 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{prop.title}</h3>
                <p className="text-sm text-muted-foreground">{prop.location} · {prop.hectares} ha · {prop.price}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(prop)}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(prop.id)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Admin;
