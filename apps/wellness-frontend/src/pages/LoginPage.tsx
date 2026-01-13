import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Petición al API Gateway -> Auth Service
      const response = await axios.post('http://localhost:3333/api/auth/login', {
        email,
        password
      });

      console.log("Respuesta del servidor:", response.data);

      // 2. Extraer los datos
      const { accessToken, user } = response.data;

      // 3. LÓGICA INTELIGENTE DE NOMBRE:
      // Si el backend trae el nombre (user.name), lo usamos.
      // Si viene vacío o null, usamos la primera parte del correo (ej: "xavier" de "xavier@uce...")
      const nameToSave = user && user.name 
        ? user.name 
        : email.split('@')[0];

      // 4. Preparar el objeto de usuario completo para guardar
      const userToSave = {
        ...user,            // Mantenemos id, email, role, etc.
        name: nameToSave,   // Forzamos que tenga un nombre visible
        role: user.role || 'student' // Aseguramos que tenga un rol por defecto
      };

      // 5. Guardar en el navegador (LocalStorage)
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userToSave));

      // 6. Redirigir al Dashboard
      // (Opcional: Mostrar alerta si quieres, pero suele ser mejor ir directo)
      navigate('/dashboard');

    } catch (err: any) {
      console.error("Error en Login:", err);
      
      // Manejo de errores visual
      if (err.response) {
        // Error que viene del servidor (ej: 401 Credenciales inválidas)
        setError('Correo o contraseña incorrectos.');
      } else if (err.message) {
        // Error de conexión (Gateway apagado)
        setError(`Error de conexión: ${err.message}`);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div className="auth-container">
      {/* --- LADO IZQUIERDO (Branding Azul) --- */}
      <div className="auth-left">
        <Activity size={80} color="#fbbf24" />
        <h1>UCE Wellness</h1>
        <p>Asistente de Bienestar Universitario</p>
        <p style={{ marginTop: '20px', opacity: 0.8, maxWidth: '300px', lineHeight: '1.5' }}>
          Tu salud mental y física es nuestra prioridad. Accede a tus evaluaciones, citas y recursos exclusivos.
        </p>
      </div>

      {/* --- LADO DERECHO (Formulario) --- */}
      <div className="auth-right">
        <div className="login-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '50%' }}>
              <ShieldCheck size={24} color="#0f2a4a"/>
            </div>
            <h2 style={{ color: '#0f2a4a', margin: 0 }}>Iniciar Sesión</h2>
          </div>
          
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Ingresa con tu correo institucional
          </p>
          
          {/* Mensaje de Error */}
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '12px', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              marginBottom: '20px',
              border: '1px solid #ef9a9a'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label style={{ fontWeight: 600, color: '#444' }}>Correo Electrónico</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="ejemplo@uce.edu.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label style={{ fontWeight: 600, color: '#444', marginTop: '10px', display: 'block' }}>Contraseña</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary" style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <LogIn size={20} /> INGRESAR AL SISTEMA
            </button>
          </form>

          <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.95rem' }}>
            ¿No tienes cuenta? <a href="/register" style={{ color: '#0f2a4a', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};