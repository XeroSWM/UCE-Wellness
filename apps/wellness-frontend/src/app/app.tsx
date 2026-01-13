import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importa tus páginas existentes
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Importa lo nuevo del Estudiante (RUTAS AJUSTADAS A TU ESTRUCTURA)
import StudentLayout from '../pages/student/StudentLayout';
import Dashboard from '../pages/student/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        {/* RUTAS DEL ESTUDIANTE */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Placeholders para que los botones funcionen por ahora */}
          <Route path="agendar" element={<div className="p-8">Módulo de Agendamiento (Pronto)</div>} />
          <Route path="historial" element={<div className="p-8">Historial Médico (Pronto)</div>} />
          <Route path="perfil" element={<div className="p-8">Perfil de Usuario (Pronto)</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;