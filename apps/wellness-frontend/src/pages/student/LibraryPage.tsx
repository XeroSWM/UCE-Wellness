import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BookOpen, Video, Music, FileText, Search, Filter, ExternalLink, Sparkles, Plus, X, UploadCloud } from 'lucide-react';

export default function LibraryPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el Modal de Subida
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del Formulario
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // --- 1. Cargar Recursos ---
  const fetchResources = async () => {
    try {
      setLoading(true);
      // Ajusta el puerto: 3007 (Directo) o 3333 (Gateway)
      const response = await axios.get('http://localhost:3007/api/resources'); 
      setResources(response.data);
    } catch (error) {
      console.error("Error cargando biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // --- 2. Función para Subir Archivo ---
  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return alert("Selecciona un archivo");

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', newTitle);
    formData.append('category', newCategory);

    try {
      setUploading(true);
      // POST al Backend
      await axios.post('http://localhost:3007/api/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Cerrar y Recargar
      alert("¡Recurso subido con éxito!");
      setIsModalOpen(false);
      setNewTitle('');
      fetchResources(); // Recargar lista (Redis se habrá limpiado)

    } catch (error) {
      console.error("Error subiendo:", error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  // --- Filtros y Estilos ---
  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceTheme = (type: string) => {
    switch(type) {
      case 'VIDEO': return { icon: <Video size={20}/>, color: '#ef4444', bg: '#fef2f2', label: 'Video' };
      case 'AUDIO': return { icon: <Music size={20}/>, color: '#8b5cf6', bg: '#f5f3ff', label: 'Audio' };
      default: return { icon: <FileText size={20}/>, color: '#3b82f6', bg: '#eff6ff', label: 'Documento' };
    }
  };

  return (
    <div className="dashboard-container animate-in" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* CABECERA */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: '10px' }}>
          <BookOpen size={36} color="#2563eb"/> Biblioteca de Bienestar
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Recursos curados para tu éxito.</p>
      </div>

      {/* BUSCADOR */}
      <div style={{ background: 'white', padding: '10px 20px', display: 'flex', gap: '15px', marginBottom: '40px', alignItems: 'center', borderRadius: '50px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', maxWidth: '800px', marginInline: 'auto' }}>
        <Search color="#64748b" size={20} />
        <input type="text" placeholder="Buscar..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#334155' }} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* GRID DE RECURSOS */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando recursos...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredResources.map((res) => {
            const theme = getResourceTheme(res.type);
            return (
              <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="resource-card-modern" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div style={{ background: theme.bg, color: theme.color, padding: 12, borderRadius: '12px' }}>{theme.icon}</div>
                  <ExternalLink size={18} color="#cbd5e1" className="external-link-icon"/>
                </div>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.1rem' }}>{res.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{res.category}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* BOTÓN FLOTANTE PARA SUBIR (ADMIN) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)', cursor: 'pointer', zIndex: 100 }}
      >
        <Plus size={30} />
      </button>

      {/* MODAL DE SUBIDA */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '400px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            
            <h2 style={{ marginTop: 0, color: '#0f2a4a' }}>Subir Nuevo Recurso</h2>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#64748b' }}>Título</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Ej: Guía de Sueño" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#64748b' }}>Categoría</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>General</option>
                  <option>Salud Mental</option>
                  <option>Académico</option>
                  <option>Mindfulness</option>
                </select>
              </div>
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={30} color="#64748b" />
                <p style={{ margin: '10px 0 0', fontSize: '0.9rem', color: '#64748b' }}>Click para seleccionar archivo</p>
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.mp4,.mp3,.jpg,.png" />
              </div>

              <button disabled={uploading} type="submit" style={{ background: '#2563eb', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
                {uploading ? 'Subiendo...' : 'Publicar Recurso'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .resource-card-modern {
          background: white; padding: 25px; border-radius: 20px; border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: all 0.3s ease; cursor: pointer; display: block;
        }
        .resource-card-modern:hover {
          transform: translateY(-7px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08); border-color: #e2e8f0;
        }
        .resource-card-modern:hover .external-link-icon { color: #3b82f6 !important; }
      `}</style>
    </div>
  );
}