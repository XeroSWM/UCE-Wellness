import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL de tu microservicio
const PROFILE_API_URL = 'http://localhost:3001/api/profiles';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    semester: '',
    faculty: '',
    career: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setFormData(prev => ({ ...prev, name: parsedUser.name || '' }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return alert('Error: No se encontró ID de usuario.');

    setLoading(true);
    try {
      const payload = { userId: userData.id, ...formData };
      await axios.post(PROFILE_API_URL, payload);
      alert('✅ ¡Perfil actualizado correctamente!');
    } catch (error) {
      console.error(error);
      alert('❌ Error al actualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  // === ESTILOS ROBUSTOS ===
  const styles = {
    // Este contenedor fuerza el centrado horizontal y vertical
    pageContainer: {
      width: '100%',
      minHeight: '100%',
      backgroundColor: '#f1f5f9', // Gris muy suave
      display: 'flex',
      justifyContent: 'center', // Centrado Horizontal
      alignItems: 'flex-start', // Alineado arriba (pero con margen)
      paddingTop: '40px',
      paddingBottom: '40px',
    },
    card: {
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '600px', // Ancho máximo para que se vea elegante
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Sombra moderna
    },
    header: {
      marginBottom: '30px',
      borderBottom: '2px solid #f1f5f9',
      paddingBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '14px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '15px',
      color: '#334155',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const,
      backgroundColor: '#fff',
    },
    button: {
      marginTop: '20px',
      width: '100%',
      backgroundColor: '#2563eb', // Azul UCE
      color: 'white',
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
      transition: 'background-color 0.2s',
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span>👤</span> Completar mi Perfil
          </h2>
          <p style={styles.subtitle}>
            Actualiza tu información para mejorar las alertas y recomendaciones.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Teléfono Celular (Para alertas)</label>
            <input
              style={styles.input}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Ej: 099..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Facultad</label>
              <input
                style={styles.input}
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="Ingeniería..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Carrera</label>
              <input
                style={styles.input}
                type="text"
                name="career"
                value={formData.career}
                onChange={handleChange}
                placeholder="Sistemas..."
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Semestre Actual</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Selecciona...</option>
              <option value="1ro">1ro Semestre</option>
              <option value="2do">2do Semestre</option>
              <option value="3ro">3ro Semestre</option>
              <option value="4to">4to Semestre</option>
              <option value="5to">5to Semestre</option>
              <option value="6to">6to Semestre</option>
              <option value="7mo">7mo Semestre</option>
              <option value="8vo">8vo Semestre</option>
              <option value="9no">9no Semestre</option>
              <option value="10mo">10mo Semestre</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Información'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfilePage;