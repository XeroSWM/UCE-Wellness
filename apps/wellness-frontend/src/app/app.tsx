import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import '../styles.css'; // Importa los estilos globales
import { DashboardPage } from '../pages/DashboardPage';

// Dashboard temporal (Solo para probar que el login redirige bien)
const DashboardDummy = () => (
  <div style={{ padding: 40 }}>
    <h1>¡Hola de nuevo, Xavier! 👋</h1>
    <p>Has iniciado sesión correctamente. Aquí irá el Dashboard real.</p>
    <button onClick={() => {
      localStorage.clear();
      window.location.href = '/';
    }}>Cerrar Sesión</button>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Cualquier ruta desconocida redirige al Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;