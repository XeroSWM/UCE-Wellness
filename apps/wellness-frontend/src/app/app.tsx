import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. IMPORTACIONES
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Importa lo del estudiante
import StudentLayout from '../pages/student/StudentLayout';
import Dashboard from '../pages/student/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* CORRECCIÓN AQUÍ: */}
        {/* Antes te mandaba al dashboard. Ahora te manda al Login por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* === ROL ESTUDIANTE (Protegido) === */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Rutas adicionales */}
          <Route path="evaluaciones" element={<div className="p-10">Evaluaciones (Pronto)</div>} />
          <Route path="citas" element={<div className="p-10">Citas Médicas (Pronto)</div>} />
          <Route path="asistente" element={<div className="p-10">Chat con IA (Pronto)</div>} />
          <Route path="biblioteca" element={<div className="p-10">Biblioteca (Pronto)</div>} />
          <Route path="progreso" element={<div className="p-10">Mi Progreso (Pronto)</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;