import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function ProgressPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ trend: 'Estable', average: 0 });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. Obtener ID del usuario logueado (desde localStorage)
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        // Si no hay usuario (estás probando directo), usamos un ID temporal o pedimos login
        const userId = user?.id || user?._id || 'usuario_prueba'; 

        console.log("Cargando historial para:", userId);

        // 2. Llamada al Backend
        const response = await axios.get(`http://localhost:3002/api/assessments/history/${userId}`);
        const data = response.data;

        // 3. Procesar datos para visualización (Colores y Estados)
        const processedData = data.map((item: any) => {
          const score = item.totalScore;
          let status = 'Bajo';
          let color = 'text-green-600';
          let bg = 'bg-green-50';

          // Lógica simple de semáforo (ajustable según el test)
          if (score > 13) { status = 'Moderado'; color = 'text-orange-600'; bg = 'bg-orange-50'; }
          if (score > 26) { status = 'Alto'; color = 'text-red-600'; bg = 'bg-red-50'; }

          return {
            ...item,
            formattedDate: new Date(item.createdAt).toLocaleDateString('es-ES', { 
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            }),
            status,
            color,
            bg
          };
        });

        setHistory(processedData);
        setLoading(false);

      } catch (error) {
        console.error("Error cargando historial:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="dashboard-container animate-in">
      
      {/* Cabecera */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f2a4a', marginBottom: '10px', fontWeight: 'bold' }}>
            Mi Progreso y Resultados
          </h1>
          <p style={{ color: '#64748b' }}>Historial clínico de tus evaluaciones psicológicas.</p>
        </div>
        <div style={{ background: '#eff6ff', padding: '10px 20px', borderRadius: '8px', color: '#2563eb', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} />
          <span>Registros: {history.length}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Columna Izquierda: Historial Detallado */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} /> Últimas Evaluaciones
          </h3>

          {loading ? (
            <p>Cargando datos...</p>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <p>No has realizado ninguna evaluación todavía.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {history.map((item) => (
                <div key={item._id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px',
                  backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {/* Info Izquierda */}
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '50%' }}>
                      <BarChart2 size={24} color="#64748b" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#0f2a4a', fontSize: '1rem' }}>{item.assessmentTitle}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <Calendar size={14} /> {item.formattedDate}
                      </div>
                    </div>
                  </div>

                  {/* Puntaje Derecha */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f2a4a' }}>{item.totalScore}</span>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}> / {item.maxScore}</span>
                    <div className={`${item.bg} ${item.color}`} style={{ 
                      fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', marginTop: '5px', textAlign: 'center' 
                    }}>
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Recomendaciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ background: '#0f2a4a', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '10px', marginTop: 0 }}>Análisis Rápido</h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.6' }}>
              El sistema analiza tus patrones de respuesta para detectar riesgos tempranos.
            </p>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.85rem' }}>
              💡 <strong>Nota:</strong> Si tus puntajes son altos, el "Botón de Crisis" está disponible 24/7 en el menú.
            </div>
          </div>

          <div className="card">
            <h4 style={{ color: '#1e293b', marginBottom: '15px', marginTop: 0 }}>Referencia de Niveles</h4>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: '#64748b', display: 'grid', gap: '10px' }}>
              <li><strong style={{ color: '#16a34a' }}>0-13:</strong> Bajo (Normal)</li>
              <li><strong style={{ color: '#ea580c' }}>14-26:</strong> Moderado (Precaución)</li>
              <li><strong style={{ color: '#dc2626' }}>27+:</strong> Alto (Buscar Ayuda)</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}