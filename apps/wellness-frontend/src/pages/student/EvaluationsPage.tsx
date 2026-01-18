import { ArrowRight, ClipboardList, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EvaluationsPage() {
  return (
    <div className="dashboard-container animate-in">
      
      {/* Cabecera Centrada (Como en tu imagen) */}
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f2a4a', marginBottom: '10px', fontWeight: 'bold' }}>
          Evaluaciones Psicológicas
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Este módulo está conectado al Assessment-Service.
        </p>
      </div>

      {/* Grid de Tests (Tarjetas Blancas y Amplias) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Tarjeta 1: Test de Estrés */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px 30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid #f1f5f9'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f2a4a', marginBottom: '10px' }}>
            Test de Estrés Percibido
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
            Mide tu nivel de estrés percibido en el último mes.
          </p>
          
          {/* Botón Texto */}
          <Link to="/student/evaluacion/estres" style={{ 
            color: '#0f2a4a', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.95rem'
          }}>
            Iniciar Evaluación <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tarjeta 2: Beck */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px 30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid #f1f5f9'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f2a4a', marginBottom: '10px' }}>
            Inventario de Depresión de Beck
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
            Evaluación estandarizada del estado de ánimo.
          </p>
          
          {/* Botón Texto */}
          <Link to="/student/evaluacion/beck" style={{ 
            color: '#0f2a4a', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.95rem'
          }}>
            Iniciar Evaluación <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}