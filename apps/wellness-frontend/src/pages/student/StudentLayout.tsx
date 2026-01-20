import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Calendar, Bot, BookOpen, BarChart2, LogOut, Menu, X, AlertTriangle } from 'lucide-react';

export default function StudentLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para el nombre, por defecto "Xavier Monteros"
  const [displayName, setDisplayName] = useState("Xavier Monteros");
  
  // === CORRECCIÓN DE ERRORES DE LINTING AQUÍ ===
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setDisplayName(parsed.name);
      } catch (error) {
        // Ahora usamos 'error' y no dejamos el bloque vacío
        console.error("Error al leer datos del usuario:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/student/dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/student/evaluaciones', label: 'Evaluaciones', icon: <ClipboardList size={20} /> },
    { path: '/student/citas', label: 'Citas', icon: <Calendar size={20} /> },
    { path: '/student/asistente', label: 'Asistente IA', icon: <Bot size={20} /> },
    { path: '/student/biblioteca', label: 'Biblioteca', icon: <BookOpen size={20} /> },
    { path: '/student/progreso', label: 'Mi Progreso', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="student-layout">
      
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <h2>UCE-Wellness</h2>
            <p>Asistente de Bienestar</p>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="sidebar-close-btn">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-crisis">
            <AlertTriangle size={20} />
            BOTÓN DE CRISIS
          </button>

          <button 
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: '#bfdbfe', display: 'flex', gap: '10px', cursor: 'pointer', padding: '10px', width: '100%', alignItems: 'center' }}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="main-content">
        <header className="top-header">
          <button onClick={() => setIsMobileOpen(true)} className="menu-btn">
             <Menu size={24} color="#333"/> 
             <span style={{ fontWeight: 'bold', color: '#0f2a4a' }}>Menú</span>
          </button>
          
          {/* Info de Usuario Clickeable */}
          <div 
            className="user-info" 
            onClick={() => navigate('/student/perfil')} 
            style={{ cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right', marginRight: '10px' }} className="hidden-mobile">
              <p style={{ fontWeight: 'bold', color: '#334155', margin: 0, fontSize: '0.9rem' }}>
                {displayName}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Estudiante UCE</p>
            </div>
            <div className="avatar">
                {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
      
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
    </div>
  );
}