import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Calendar, Bot, BookOpen, BarChart2, LogOut, Menu, X, AlertTriangle } from 'lucide-react';

export default function StudentLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

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

          <button style={{ background: 'none', border: 'none', color: '#bfdbfe', display: 'flex', gap: '10px', cursor: 'pointer', padding: '10px', width: '100%', alignItems: 'center' }}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="main-content">
        <header className="top-header">
          {/* Botón Menú (Solo visible en Móvil) */}
          <button onClick={() => setIsMobileOpen(true)} className="menu-btn">
             <Menu size={24} color="#333"/> 
             <span style={{ fontWeight: 'bold', color: '#0f2a4a' }}>Menú</span>
          </button>
          
          {/* Info Usuario */}
          <div className="user-info">
            <div style={{ textAlign: 'right', marginRight: '10px' }} className="hidden-mobile">
              <p style={{ fontWeight: 'bold', color: '#334155', margin: 0, fontSize: '0.9rem' }}>Xavier Monteros</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>8vo Semestre • 002</p>
            </div>
            <div className="avatar">XM</div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay Móvil */}
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
    </div>
  );
}