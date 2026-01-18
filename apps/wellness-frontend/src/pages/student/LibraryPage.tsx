import { useState } from 'react';
import { BookOpen, Video, FileText, Search, ExternalLink, PlayCircle, Download } from 'lucide-react';

// --- BASE DE DATOS LOCAL DE RECURSOS ---
// Aquí "curamos" el contenido manualmente para asegurar calidad.
const RESOURCES = [
  {
    id: 1,
    title: "En tiempos de estrés, haz lo que importa",
    description: "Guía ilustrada de la OMS para manejar situaciones difíciles.",
    type: "PDF",
    category: "Estrés",
    url: "https://iris.who.int/bitstream/handle/10665/336218/9789240009591-spa.pdf",
    thumbnail: "https://via.placeholder.com/150/e0f2fe/0f2a4a?text=Guia+OMS"
  },
  {
    id: 2,
    title: "Meditación Guiada: Relajación Muscular",
    description: "Técnica de Jacobson para reducir la tensión física en 10 minutos.",
    type: "VIDEO",
    category: "Relajación",
    url: "https://www.youtube.com/watch?v=1s97t6b7p2E", // Link de ejemplo
    thumbnail: "https://via.placeholder.com/150/fef3c7/b45309?text=Video+Relax"
  },
  {
    id: 3,
    title: "Ansiedad ante los Exámenes",
    description: "Estrategias prácticas para afrontar el bloqueo académico.",
    type: "PDF",
    category: "Académico",
    url: "https://clinica.ucm.es/data/cont/media/www/pag-13437/Ansiedad%20ante%20los%20ex%C3%A1menes.pdf",
    thumbnail: "https://via.placeholder.com/150/dbeafe/1e40af?text=Examenes"
  },
  {
    id: 4,
    title: "Hablemos de Depresión",
    description: "Folleto informativo de la OPS para identificar síntomas.",
    type: "WEB",
    category: "Depresión",
    url: "https://www.paho.org/es/temas/depresion",
    thumbnail: "https://via.placeholder.com/150/fee2e2/991b1b?text=Info+OPS"
  },
  {
    id: 5,
    title: "Kit de Primeros Auxilios Emocionales",
    description: "Herramientas rápidas para momentos de crisis.",
    type: "PDF",
    category: "Crisis",
    url: "https://www.cruzroja.es/prevencion/codigos/14023000/docs/guia_primeros_auxilios_psicologicos.pdf",
    thumbnail: "https://via.placeholder.com/150/f3e8ff/6b21a8?text=Primeros+Aux"
  }
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');

  // Lógica de Filtrado
  const filteredResources = RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || r.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Todos', 'Estrés', 'Depresión', 'Relajación', 'Académico', 'Crisis'];

  // Función para obtener icono según tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={16} />;
      case 'VIDEO': return <Video size={16} />;
      case 'WEB': return <BookOpen size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  return (
    <div className="dashboard-container animate-in">
      
      {/* Cabecera */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f2a4a', fontWeight: 'bold' }}>Biblioteca de Bienestar</h1>
        <p style={{ color: '#64748b' }}>Recursos seleccionados para tu salud mental y éxito académico.</p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="card" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Buscador */}
        <div style={{ position: 'relative' }}>
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Buscar guías, videos o artículos..." 
            className="input-field"
            style={{ paddingLeft: '45px', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tags de Categoría */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filter === cat ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: filter === cat ? '#2563eb' : 'white',
                color: filter === cat ? 'white' : '#64748b',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Recursos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Thumbnail (Opcional, si no quieres imágenes borra este bloque) */}
            <div style={{ height: '120px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
               {/* Usamos iconos grandes si no hay imagen real */}
               {resource.type === 'VIDEO' ? <PlayCircle size={40} color="#cbd5e1"/> : <BookOpen size={40} color="#cbd5e1"/>}
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              
              {/* Etiqueta Tipo */}
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 5, 
                fontSize: '0.75rem', fontWeight: 'bold', 
                color: resource.type === 'VIDEO' ? '#b45309' : '#1e40af',
                background: resource.type === 'VIDEO' ? '#fef3c7' : '#dbeafe',
                padding: '4px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '10px'
              }}>
                {getTypeIcon(resource.type)} {resource.type}
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#0f2a4a', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                {resource.title}
              </h3>
              
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 20px 0', flex: 1 }}>
                {resource.description}
              </p>

              <a 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary"
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px',
                  background: 'white',
                  color: '#2563eb',
                  border: '1px solid #2563eb'
                }}
              >
                {resource.type === 'PDF' ? <Download size={18} /> : <ExternalLink size={18} />}
                {resource.type === 'VIDEO' ? 'Ver Video' : 'Abrir Recurso'}
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
         <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}>
           No se encontraron recursos para "{searchTerm}" en la categoría {filter}.
         </div>
      )}

    </div>
  );
}