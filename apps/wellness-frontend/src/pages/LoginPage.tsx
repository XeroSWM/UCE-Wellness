import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity } from 'lucide-react'; // Íconos bonitos

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Petición al API Gateway (Puerto 3333) -> Auth Service
      const response = await axios.post('http://localhost:3333/api/auth/login', {
        email,
        password
      });

      // 2. Guardar el Token que nos devuelve el backend
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Guardamos datos básicos

      // 3. Redirigir al Dashboard
      alert('¡Bienvenido a UCE Wellness!');
      navigate('/dashboard');

    } catch (err) {
      setError('Credenciales incorrectas o error en el servidor.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      {/* Lado Izquierdo (Azul - Marca) */}
      <div className="auth-left">
        <Activity size={80} color="#fbbf24" />
        <h1>UCE Wellness</h1>
        <p>Asistente de Bienestar Universitario</p>
        <p style={{ marginTop: '20px', opacity: 0.8 }}>
          Tu salud mental y física es nuestra prioridad.
        </p>
      </div>

      {/* Lado Derecho (Formulario) */}
      <div className="auth-right">
        <div className="login-box">
          <h2 style={{ color: '#0f2a4a' }}>Iniciar Sesión</h2>
          <p>Ingresa con tu correo institucional</p>
          
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="ejemplo@uce.edu.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
              INGRESAR AL SISTEMA
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <a href="/register" style={{ color: '#0f2a4a', fontWeight: 'bold' }}>Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};