import React from 'react';
import { 
  LayoutDashboard, ClipboardList, Calendar, Bot, BookOpen, 
  Activity, AlertTriangle, LogOut, HeartPulse, Users, FileText, Shield, Database 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Datos simulados (Mock Data)
const data = [
  { name: 'Lun', stress: 40 }, { name: 'Mar', stress: 30 },
  { name: 'Mie', stress: 60 }, { name: 'Jue', stress: 45 },
  { name: 'Vie', stress: 80 }, { name: 'Sab', stress: 50 },
  { name: 'Dom', stress: 30 },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  
  // 1. LEEMOS EL USUARIO DEL LOCALSTORAGE
  // Si no hay usuario, usamos un objeto vacío para evitar errores
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // 2. OBTENEMOS EL ROL (Si no tiene, asumimos 'student')
  // Nota: Asegúrate de que tu Login guarde el rol en localStorage, 
  // si no, aquí siempre será 'student'.
  const role = user.role || 'student'; 
  const userName = user.name || 'Usuario';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="brand">
          <Activity size={32} color="#fbbf24" />
          <h2>UCE-Wellness</h2>
        </div>
        
        <nav>
          {/* Enlace común para todos */}
          <a href="#" className="active"><LayoutDashboard size={20}/> Inicio</a>
          
          {/* --- VISTA ESTUDIANTE --- */}
          {role === 'student' && (
            <>
              <a href="#"><ClipboardList size={20}/> Evaluaciones</a>
              <a href="#"><Calendar size={20}/> Mis Citas</a>
              <a href="#"><Bot size={20}/> Asistente IA</a>
              <a href="#"><BookOpen size={20}/> Biblioteca</a>
              <a href="#"><HeartPulse size={20}/> Mi Progreso</a>
            </>
          )}

          {/* --- VISTA ESPECIALISTA (DOCTOR) --- */}
          {role === 'specialist' && (
            <>
              <a href="#"><Users size={20}/> Pacientes</a>
              <a href="#"><Calendar size={20}/> Agenda Médica</a>
              <a href="#"><FileText size={20}/> Historiales</a>
              <a href="#"><Activity size={20}/> Telemetría</a>
            </>
          )}

          {/* --- VISTA ADMINISTRADOR --- */}
          {role === 'admin' && (
            <>
              <a href="#"><Shield size={20}/> Gestión Usuarios</a>
              <a href="#"><Database size={20}/> Base de Datos</a>
              <a href="#"><AlertTriangle size={20}/> Logs de Error</a>
            </>
          )}
        </nav>

        <div className="logout-section">
          {role === 'student' && (
            <button className="btn-crisis">
              <AlertTriangle size={18}/> BOTÓN DE CRISIS
            </button>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18}/> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        
        {/* Banner de Bienvenida Dinámico */}
        <header className="welcome-banner">
          <div>
            <h1>
              {/* Cambia el saludo según el rol */}
              {role === 'specialist' ? '👨‍⚕️ Dr/a. ' : '👋 Hola de nuevo, '} 
              {userName}!
            </h1>
            <p>
              {role === 'student' && 'Tu bienestar es nuestra prioridad hoy. ¿Cómo te sientes?'}
              {role === 'specialist' && 'Tienes 3 consultas pendientes y 1 alerta de paciente.'}
              {role === 'admin' && 'El sistema opera al 100% de capacidad. Sin incidentes.'}
            </p>
            
            <div className="action-buttons">
              {role === 'student' ? (
                <>
                  <button className="btn-action primary">Tomar Test Diario</button>
                  <button className="btn-action secondary">Ver Recursos</button>
                </>
              ) : (
                <button className="btn-action primary">Ver Panel de Control</button>
              )}
            </div>
          </div>
        </header>

        {/* Grilla de Widgets (Por ahora mostramos la gráfica a todos) */}
        <div className="widgets-grid">
          <div className="card">
            <h3>
              {role === 'specialist' ? 'Pacientes Atendidos' : 'Progreso Semanal'}
            </h3>
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

          <div className="card cita-card">
            <div className="icon-bg"><Calendar size={24} color="#0984e3"/></div>
            <div>
              <h3>Agenda</h3>
              <p className="highlight">10:30 AM</p>
              <p className="subtext">
                {role === 'student' ? 'Cita con Dr. Guevara' : 'Paciente: Juan Pérez'}
              </p>
            </div>
          </div>

          <div className="card full-width">
            <h3>⚡ Estado del Ecosistema</h3>
            <div className="microservices-grid">
              {['Auth', 'Profiles', 'Appointments', 'Analytics'].map((service) => (
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