import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, CheckCircle, ArrowRight, AlertCircle, Stethoscope } from 'lucide-react';

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  
  // Estados para la lógica
  const [doctors, setDoctors] = useState<any[]>([]); 
  const [loadingDocs, setLoadingDocs] = useState(true);
  
  // Estados del formulario
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Consulta General');
  const [reason, setReason] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Horarios
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  // 1. EFECTO: CARGAR DOCTORES (VÍA API GATEWAY - PUERTO 3333)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("🔍 Buscando doctores en el API Gateway (3333)...");
        
        // CAMBIO REALIZADO: Puerto 3333 para que pasen los doctores que registraste
        const response = await axios.get('http://localhost:3333/api/auth/doctors');
        
        console.log("✅ Doctores encontrados:", response.data);

        // Transformamos los datos
        const doctorsData = response.data.map((doc: any) => ({
          id: doc.id,
          name: doc.name || doc.fullName || 'Doctor Sin Nombre',
          specialty: doc.specialty || 'Especialista en Bienestar', 
          available: true 
        }));

        setDoctors(doctorsData);
      } catch (error) {
        console.error("❌ Error cargando doctores:", error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDoctors();
  }, []);

  // 2. FUNCIÓN: ENVIAR LA CITA (VÍA API GATEWAY - PUERTO 3333)
  const handleSubmit = async () => {
    if (!selectedDoc || !date || !time) {
      alert("⚠️ Por favor selecciona un Doctor, una Fecha y una Hora.");
      return;
    }

    setLoadingSubmit(true);

    try {
      // Obtener ID del estudiante logueado
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const studentId = user?.id || user?._id || 'estudiante_anonimo';

      const payload = {
        studentId: studentId,
        doctorId: selectedDoc.id,
        professionalName: selectedDoc.name,
        date: `${date} ${time}:00`,
        type: type,
        status: 'SCHEDULED',
        reason: reason || 'Sin motivo especificado',
        meetingLink: 'https://zoom.us/j/esperando-asignacion'
      };

      console.log("🚀 Enviando cita al Gateway:", payload);

      // CAMBIO REALIZADO: Usamos también el 3333 para enviar la cita.
      // (Nota: Asegúrate de que tu Gateway sepa redirigir /api/appointments al microservicio correcto)
      // Si esto falla, cambia este 3333 por 3003, pero lo ideal es usar el Gateway.
      await axios.post('http://localhost:3003/api/appointments', payload);

      alert(`✅ ¡Cita Confirmada!\n\nProfesional: ${selectedDoc.name}\nFecha: ${date} a las ${time}`);
      navigate('/student/citas'); 

    } catch (error) {
      console.error("Error al agendar:", error);
      alert("Hubo un error al guardar la cita. Verifica la conexión con el Gateway (3333).");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="dashboard-container animate-in">
      
      {/* Cabecera */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f2a4a', marginBottom: '10px', fontWeight: 'bold' }}>
          Agendar Nueva Cita
        </h1>
        <p style={{ color: '#64748b' }}>Selecciona un profesional disponible y reserva tu espacio.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', gridColumn: 'span 2' }}>
          
          {/* SELECCIÓN DE PROFESIONAL */}
          <div className="card">
            <h3 style={{ color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="#2563eb" /> 1. Selecciona un Profesional
            </h3>

            {loadingDocs ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Cargando lista de doctores...</div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '15px', background: '#fff1f2', color: '#9f1239', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <AlertCircle size={20} />
                <span>No se encontraron doctores registrados en el sistema. (Asegúrate de tener usuarios con rol 'DOCTOR')</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      padding: '15px',
                      border: selectedDoc?.id === doc.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      background: selectedDoc?.id === doc.id ? '#eff6ff' : 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedDoc?.id === doc.id ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '50%', color: '#1e40af' }}>
                        <Stethoscope size={18} />
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#0f2a4a', fontSize: '0.95rem' }}>{doc.name}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '42px' }}>{doc.specialty}</div>
                    
                    {selectedDoc?.id === doc.id && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <CheckCircle size={18} color="#2563eb" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FECHA Y HORA */}
          <div className="card">
            <h3 style={{ color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color="#2563eb" /> 2. Elige Fecha y Hora
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Fecha deseada</label>
                <input 
                  type="date" 
                  className="input-field" 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Tipo de Sesión</label>
                 <select 
                    className="input-field"
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
                 >
                   <option>Consulta General</option>
                   <option>Evaluación Inicial</option>
                   <option>Seguimiento</option>
                   <option>Crisis / Urgencia</option>
                 </select>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Horarios Disponibles</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: time === slot ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: time === slot ? '#2563eb' : 'white',
                    color: time === slot ? 'white' : '#475569',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* MOTIVO */}
          <div className="card">
            <h3 style={{ color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#2563eb" /> 3. Motivo (Opcional)
            </h3>
            <textarea
              rows={3}
              placeholder="Describa brevemente cómo se siente o la razón de su consulta..."
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
            />
          </div>

        </div>

        {/* COLUMNA DERECHA: RESUMEN FLOTANTE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ position: 'sticky', top: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#0f2a4a', marginTop: 0, fontSize: '1.2rem' }}>Resumen de Cita</h3>
            
            <div style={{ display: 'grid', gap: '12px', fontSize: '0.9rem', marginBottom: '25px', marginTop: '15px' }}>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>PROFESIONAL</span>
                <strong style={{ color: '#1e293b', fontSize: '1rem' }}>{selectedDoc ? selectedDoc.name : '- Seleccione -'}</strong>
              </div>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>FECHA Y HORA</span>
                <strong style={{ color: '#1e293b', fontSize: '1rem' }}>
                  {date ? date : '-'} {time ? `a las ${time}` : ''}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>MODALIDAD</span>
                <strong style={{ color: '#1e293b' }}>Virtual (Zoom)</strong>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loadingSubmit}
              style={{ justifyContent: 'center', background: '#0f2a4a', color: 'white' }}
            >
              {loadingSubmit ? 'Procesando...' : (
                <>Confirmar Cita <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}