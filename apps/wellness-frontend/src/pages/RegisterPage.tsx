import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Activity } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    try {
      console.log("Enviando datos:", { name, email, password }); // Log para depurar

      // 1. Petición al Backend
      await axios.post('http://localhost:3333/api/auth/register', {
        name: name,      // Enviamos el nombre
        email: email,    // Enviamos el correo
        password: password // Enviamos la contraseña
      });

      // 2. Si todo sale bien:
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');

    } catch (err: any) {
      console.error("❌ ERROR DETALLADO:", err);

      // 3. Lógica para mostrar el error REAL del servidor
      if (err.response && err.response.data) {
        // El Backend nos respondió con un error (ej: validación fallida)
        const serverMessage = err.response.data.message;
        
        // A veces NestJS devuelve un array de errores, tomamos el primero
        const displayMsg = Array.isArray(serverMessage) 
          ? serverMessage[0] 
          : serverMessage || JSON.stringify(err.response.data);

        setError(`Backend dice: ${displayMsg}`);
      } else if (err.message) {
        // Error de conexión (Gateway apagado, CORS, etc.)
        setError(`Error de Conexión: ${err.message}`);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Panel Izquierdo (Branding) */}
      <div className="auth-left">
        <Activity size={80} color="#fbbf24" />
        <h1>Únete a UCE Wellness</h1>
        <p>Comienza tu camino hacia el bienestar integral.</p>
      </div>

      {/* Panel Derecho (Formulario) */}
      <div className="auth-right">
        <div className="login-box">
          <h2 style={{ color: '#0f2a4a' }}>Crear Cuenta</h2>
          <p>Ingresa tus datos institucionales</p>
          
          {/* Aquí se mostrará el error real en rojo */}
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              fontSize: '0.9rem',
              border: '1px solid #ef9a9a'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
            <label>Nombre Completo</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Xavier Monteros"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Correo Institucional</label>
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
              minLength={6} // Validación básica HTML
            />

            <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
              <UserPlus size={18} style={{marginRight: 5}}/> REGISTRARME
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            ¿Ya tienes cuenta? <a href="/login" style={{ color: '#0f2a4a', fontWeight: 'bold' }}>Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};