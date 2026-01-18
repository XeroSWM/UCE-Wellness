import { Smile, ArrowRight, BookOpen, MessageCircle, AlertCircle, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      
      {/* 1. Banner Principal */}
      <div className="welcome-banner">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', marginTop: 0 }}>¡Hola de nuevo, Xavier!</h1>
          <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '1.1rem' }}>
            Tu bienestar es nuestra prioridad hoy. ¿Cómo te sientes?
          </p>
          <div className="banner-actions">
            <button className="btn-test">Tomar Test</button>
            <button className="btn-resources">Ver Recursos</button>
          </div>
        </div>
        {/* Icono Grande */}
        <div style={{ opacity: 0.9 }}>
          <Smile size={100} color="#facc15" strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. Grid de Widgets */}
      <div className="dashboard-grid">
        
        {/* Gráfico de Progreso */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#334155' }}>Progreso Semanal</h3>
            <span style={{ color: '#22c55e', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>+12%</span>
          </div>
          
          {/* Barras simuladas con CSS inline para asegurar que se vean */}
          <div className="chart-container">
             {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
               <div key={i} className="chart-bar">
                 <div className="chart-bar-fill" style={{ height: `${h}%` }}></div>
               </div>
             ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>

        {/* Columna Derecha: Alertas y Citas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           
           {/* Alerta de Estrés */}
           <div className="alert-card">
             <AlertCircle color="#d97706" size={24} style={{ minWidth: '24px' }} />
             <div>
               <h4 style={{ color: '#92400e', margin: '0 0 5px 0' }}>Nivel de Estrés Elevado</h4>
               <p style={{ fontSize: '0.85rem', color: '#b45309', margin: 0, lineHeight: '1.4' }}>
                 Tu telemetría indica signos de ansiedad. ¿Deseas hablar con el Asistente IA?
               </p>
             </div>
           </div>

           {/* Próxima Cita */}
           <div className="card">
             <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Próxima Cita</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', color: '#2563eb' }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b' }}>Sesión de Seguimiento</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Dr. Guevara • Mañana 10:30 AM</p>
                </div>
             </div>
             <button style={{ width: '100%', padding: '8px', marginTop: '15px', border: '1px solid #bfdbfe', background: 'white', color: '#2563eb', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
               Preparar Sesión
             </button>
           </div>
        </div>
      </div>

      {/* 3. Recursos Sugeridos */}
      <div>
        <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '20px' }}>Recursos Sugeridos</h3>
        <div className="resources-grid">
          <ResourceCard 
            title="Mindfulness" 
            desc="Técnicas de estudio." 
            icon={<BookOpen size={20} color="#059669"/>} 
            bg="#ecfdf5"
          />
           <ResourceCard 
            title="Asistente IA" 
            desc="Soporte emocional 24/7." 
            icon={<MessageCircle size={20} color="#7c3aed"/>} 
            bg="#f5f3ff"
          />
           <ResourceCard 
            title="Test de Ansiedad" 
            desc="Evaluación de estado." 
            icon={<ClipboardList size={20} color="#2563eb"/>} 
            bg="#eff6ff"
          />
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar
function ResourceCard({ title, desc, icon, bg }: any) {
  return (
    <div className="resource-card">
      <div style={{ padding: '10px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{desc}</p>
      </div>
      <ArrowRight size={16} color="#cbd5e1" />
    </div>
  );
}