import React from 'react';
import { 
  LayoutDashboard, ClipboardList, Calendar, Bot, BookOpen, 
  Activity, AlertTriangle, LogOut, HeartPulse 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Datos simulados para la gráfica (mientras conectamos el Backend real)
const data = [
  { name: 'Lun', stress: 40 }, { name: 'Mar', stress: 30 },
  { name: 'Mie', stress: 60 }, { name: 'Jue', stress: 45 },
  { name: 'Vie', stress: 80 }, { name: 'Sab', stress: 50 },
  { name: 'Dom', stress: 30 },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Xavier"}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* 1. SIDEBAR (Menú Lateral) */}
      <aside className="sidebar">
        <div className="brand">
          <Activity size={32} color="#fbbf24" />
          <h2>UCE-Wellness</h2>
        </div>
        
        <nav>
          <a href="#" className="active"><LayoutDashboard size={20}/> Inicio</a>
          <a href="#"><ClipboardList size={20}/> Evaluaciones</a>
          <a href="#"><Calendar size={20}/> Citas</a>
          <a href="#"><Bot size={20}/> Asistente IA</a>
          <a href="#"><BookOpen size={20}/> Biblioteca</a>
          <a href="#"><HeartPulse size={20}/> Mi Progreso</a>
        </nav>

        <div className="logout-section">
          <button className="btn-crisis">
            <AlertTriangle size={18}/> BOTÓN DE CRISIS
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18}/> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* Banner de Bienvenida */}
        <header className="welcome-banner">
          <div>
            <h1>¡Hola de nuevo, {user.name}! 👋</h1>
            <p>Tu bienestar es nuestra prioridad hoy. ¿Cómo te sientes?</p>
            <div className="action-buttons">
              <button className="btn-action primary">Tomar Test Diario</button>
              <button className="btn-action secondary">Ver Recursos</button>
            </div>
          </div>
        </header>

        {/* Grilla de Widgets */}
        <div className="widgets-grid">
          
          {/* Widget 1: Gráfica de Progreso */}
          <div className="card">
            <h3>Progreso Semanal (Nivel de Estrés)</h3>
            <div style={{ width: '100%', height: 150 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="stress" stroke="#00b894" strokeWidth={3} dot={{r:4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 2: Próxima Cita */}
          <div className="card cita-card">
            <div className="icon-bg"><Calendar size={24} color="#0984e3"/></div>
            <div>
              <h3>Próxima Cita</h3>
              <p className="highlight">Mañana a las 10:30 AM</p>
              <p className="subtext">Sesión de seguimiento con Dr. J. Guevara</p>
              <button className="btn-small">Preparar Sesión</button>
            </div>
          </div>

          {/* Widget 3: Alertas Recientes */}
          <div className="card alerts-card">
            <h3>🔔 Alertas Recientes</h3>
            <div className="alert-item warning">
              <strong>Nivel de Estrés Elevado</strong>
              <p>Tu biometría indica aumento de cortisol. ¡Tómate un descanso!</p>
            </div>
            <div className="alert-item info">
              <strong>Nueva Guía Disponible</strong>
              <p>Cómo manejar la ansiedad antes de los exámenes finales.</p>
            </div>
          </div>

          {/* Widget 4: Estado del Ecosistema (Microservicios) */}
          <div className="card full-width">
            <h3>⚡ Estado del Ecosistema Distribuido</h3>
            <div className="microservices-grid">
              {['Auth', 'Profile', 'Assessment', 'Appointment', 'Notification', 'Telemetry', 'Chat', 'Analytics'].map((service) => (
                <div className="service-badge online" key={service}>
                  <div className="dot"></div>
                  <span>{service} Service</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};