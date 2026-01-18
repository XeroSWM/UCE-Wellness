import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// === 1. IMPORTACIONES DE AUTENTICACIÓN ===
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// === 2. IMPORTACIONES DE ESTUDIANTE ===
import StudentLayout from '../pages/student/StudentLayout';
import Dashboard from '../pages/student/Dashboard';
import EvaluationsPage from '../pages/student/EvaluationsPage';
import TakingAssessmentPage from '../pages/student/TakingAssessmentPage'; // Tu nombre de archivo real
import ProgressPage from '../pages/student/ProgressPage';           // Tu nombre de archivo real
import BookAppointmentPage from '../pages/student/BookAppointmentPage';
import LibraryPage from '../pages/student/LibraryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Redirección por defecto al Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* === ROL ESTUDIANTE (Protegido por Layout) === */}
        <Route path="/student" element={<StudentLayout />}>
          
          {/* Dashboard Principal */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Evaluaciones */}
          <Route path="evaluaciones" element={<EvaluationsPage />} />
          <Route path="evaluacion/:id" element={<TakingAssessmentPage />} />
          
          {/* Progreso */}
          <Route path="progreso" element={<ProgressPage />} />

          {/* Citas Médicas */}
          <Route path="citas" element={<BookAppointmentPage />} />

          {/* Biblioteca */}
          <Route path="biblioteca" element={<LibraryPage />} />

          {/* Asistente (Futuro) */}
          <Route path="asistente" element={<div className="p-10 text-center text-slate-500">🤖 Chat con IA (Próximamente)</div>} />
          
        </Route>

        {/* === RUTA 404 (Cualquier otra cosa va al login) === */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;