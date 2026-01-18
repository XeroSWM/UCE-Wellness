import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Smile, ArrowRight, BookOpen, MessageCircle, AlertCircle, ClipboardList, TrendingUp, Watch, Activity } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({ name: 'Estudiante', id: 'anonimo' });
  
  // Estado inicial con puntos vacíos para animación suave al inicio
  const [telemetryData, setTelemetryData] = useState<any[]>([
    { label: '', value: 60 },
    { label: '', value: 60 },
    { label: '', value: 60 },
    { label: '', value: 60 },
    { label: '', value: 60 },
    { label: 'Inicio', value: 60 },
  ]);

  const userIdRef = useRef('anonimo');

  useEffect(() => {
    // 1. Cargar Usuario
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      userIdRef.current = parsedUser.id || parsedUser._id;
    }

    // 2. FUNCIÓN: Pedir dato al Backend
    const fetchLiveDatapoint = async () => {
      try {
        // Petición al API Gateway (Puerto 3333)
        const response = await axios.get(`http://localhost:3004/api/telemetry/live/${userIdRef.current}`);
        const newData = response.data;
        
        // Formatear hora (ej: 10:45)
        const timeLabel = new Date(newData.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });

        // Actualizar estado: quitamos el más viejo, metemos el nuevo
        setTelemetryData(prevData => {
            const newHistory = [...prevData.slice(1), { 
                label: timeLabel, 
                value: newData.value 
            }];
            return newHistory;
        });

      } catch (error) {
        console.error("Error conectando con Smartwatch:", error);
      }
    };

    // Primera llamada inmediata
    fetchLiveDatapoint();

    // 3. INTERVALO: Cada 10 segundos (Simulación Smartwatch)
    const intervalId = setInterval(fetchLiveDatapoint, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // --- LÓGICA GRÁFICO SVG ---
  const chartHeight = 150;
  const chartWidth = 600;

  const points = telemetryData.map((d, i) => {
    const x = (i / (telemetryData.length - 1)) * chartWidth;
    const y = chartHeight - (d.value / 100) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const getPointColor = (val: number) => {
    if (val < 60) return '#10b981'; // Verde
    if (val < 85) return '#f59e0b'; // Naranja
    return '#ef4444'; // Rojo
  };

  const latestValue = telemetryData[telemetryData.length - 1].value;

  return (
    <div className="dashboard-container animate-in">
      
      {/* BANNER PRINCIPAL */}
      <div className="welcome-banner" style={{ 
        background: 'linear-gradient(90deg, #0f2a4a 0%, #1e40af 100%)', 
        borderRadius: '20px', padding: '30px', color: 'white', marginBottom: '30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.4)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', marginTop: 0 }}>¡Hola, {user.name.split(' ')[0]}!</h1>
          <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '1.1rem' }}>
            Sincronizando con tu dispositivo...
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('/student/evaluaciones')} className="btn-test" style={{ background: '#fbbf24', color: '#0f2a4a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Tomar Test
            </button>
          </div>
        </div>
        <div style={{ opacity: 0.9 }}>
          <Smile size={100} color="#facc15" strokeWidth={1.5} />
        </div>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* GRÁFICO SMARTWATCH */}
        <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: 0, color: '#0f2a4a', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Watch size={20} color="#2563eb"/> Monitor en Vivo
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Actualizando cada 10s • Sensor</span>
            </div>
            
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: getPointColor(latestValue) }}>
                    {latestValue} <span style={{fontSize: '1rem', color:'#94a3b8'}}>bpm</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end'}}>
                     <div style={{width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 5px #22c55e'}}></div>
                     <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight:'bold' }}>LIVE</span>
                </div>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#e2e8f0" strokeDasharray="5,5" strokeWidth="2" />
                
                <polyline 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="3" 
                  points={points} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ transition: 'all 0.5s ease', filter: 'drop-shadow(0px 4px 4px rgba(37, 99, 235, 0.2))' }} 
                />

                {telemetryData.map((d, i) => {
                  const x = (i / (telemetryData.length - 1)) * chartWidth;
                  const y = chartHeight - (d.value / 100) * chartHeight;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill={getPointColor(d.value)} stroke="white" strokeWidth="2" style={{ transition: 'all 0.5s ease' }}/>
                      <text x={x} y={chartHeight + 25} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="500">
                        {d.label}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>

        {/* ALERTAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="alert-card" style={{ background: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px' }}>
             <Activity color="#d97706" size={24} style={{ minWidth: '24px' }} />
             <div>
               <h4 style={{ color: '#92400e', margin: '0 0 5px 0' }}>Análisis de Ritmo</h4>
               <p style={{ fontSize: '0.85rem', color: '#b45309', margin: 0, lineHeight: '1.4' }}>
                 Monitoreo activo. Respira profundo si notas picos.
               </p>
             </div>
           </div>

           <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
             <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Próxima Cita</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', color: '#2563eb' }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b' }}>Dr. Guevara</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Mañana 10:30 AM</p>
                </div>
             </div>
             <button onClick={() => navigate('/student/citas')} style={{ width: '100%', padding: '10px', marginTop: '15px', border: '1px solid #bfdbfe', background: 'white', color: '#2563eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
               Ver Agenda
             </button>
           </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '20px' }}>Accesos Rápidos</h3>
        <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <ResourceCard title="Biblioteca" desc="Recursos PDF." icon={<BookOpen size={20} color="#059669"/>} bg="#ecfdf5" onClick={() => navigate('/student/biblioteca')}/>
          <ResourceCard title="Asistente IA" desc="Ayuda 24/7." icon={<MessageCircle size={20} color="#7c3aed"/>} bg="#f5f3ff" onClick={() => navigate('/student/asistente')}/>
          <ResourceCard title="Resultados" desc="Mis Tests." icon={<ClipboardList size={20} color="#2563eb"/>} bg="#eff6ff" onClick={() => navigate('/student/progreso')}/>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, desc, icon, bg, onClick }: any) {
  return (
    <div onClick={onClick} style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
      <div style={{ padding: '10px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{desc}</p>
      </div>
      <ArrowRight size={16} color="#cbd5e1" />
    </div>
  );
}