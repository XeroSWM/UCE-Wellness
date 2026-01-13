import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Activity, Briefcase } from 'lucide-react';

// CAMBIO IMPORTANTE: Usamos 'export default function' para evitar errores de importación
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Por defecto estudiante
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Enviando datos:", { name, email, password, role });

      // Enviamos el ROL junto con los demás datos
      // Asegúrate de que tu backend esté corriendo en el puerto 3333
      await axios.post('http://localhost:3333/api/auth/register', {
        name,
        email,
        password,
        role // El backend debe estar preparado para recibir esto
      });

      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');

    } catch (err: any) {
      console.error("❌ ERROR DETALLADO:", err);

      if (err.response && err.response.data) {
        const serverMessage = err.response.data.message;
        const displayMsg = Array.isArray(serverMessage) 
          ? serverMessage[0] 
          : serverMessage || JSON.stringify(err.response.data);
        setError(`Backend dice: ${displayMsg}`);
      } else if (err.message) {
        setError(`Error de Conexión: ${err.message}`);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Panel Izquierdo */}
      <div className="auth-left">
        <Activity size={80} color="#fbbf24" />
        <h1>Únete a UCE Wellness</h1>
        <p>Comienza tu camino hacia el bienestar integral.</p>
      </div>

      {/* Panel Derecho */}
      <div className="auth-right">
        <div className="login-box">
          <h2 style={{ color: '#0f2a4a' }}>Crear Cuenta</h2>
          <p>Ingresa tus datos institucionales</p>
          
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', color: '#c62828', padding: '10px', 
              borderRadius: '5px', marginBottom: '15px', border: '1px solid #ef9a9a'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
            <label>Nombre Completo</label>
            <input 
              type="text" className="input-field" placeholder="Ej: Xavier Monteros"
              value={name} onChange={(e) => setName(e.target.value)} required
            />

            <label>Correo Institucional</label>
            <input 
              type="email" className="input-field" placeholder="ejemplo@uce.edu.ec"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />

            <label>Contraseña</label>
            <input 
              type="password" className="input-field" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            />

            {/* SELECTOR DE ROL */}
            <label style={{display: 'flex', alignItems: 'center', gap: 5, marginTop: 10}}>
              <Briefcase size={16}/> Selecciona tu Rol (Prueba)
            </label>
            <select 
              className="input-field" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: '#f8fafc' }}
            >
              <option value="student">🎓 Estudiante</option>
              <option value="specialist">🥼 Especialista / Doctor</option>
              <option value="admin">🛡️ Administrador</option>
            </select>

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
}