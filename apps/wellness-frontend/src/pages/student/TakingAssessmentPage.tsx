import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function TakingAssessmentPage() {
  // 1. CORRECCIÓN CRÍTICA: Usamos 'id' porque en App.tsx definiste la ruta como "evaluacion/:id"
  // Si usas 'type', llegará como undefined.
  const { id } = useParams<{ id: string }>(); 
  
  const navigate = useNavigate();
  
  // Estados para manejar la lógica del test
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. CARGAR EL TEST (Lógica simplificada usando el nuevo endpoint del Backend)
  useEffect(() => {
    const fetchAssessment = async () => {
      // Validación de seguridad
      if (!id) return;

      try {
        console.log("🔍 Buscando test con ID/Tipo:", id);
        
        // PETICIÓN DIRECTA AL ENDPOINT ESPECÍFICO QUE CREAMOS
        // Nota: Asegúrate de que el puerto (3002 o 3006) coincida con tu consola negra
        const response = await axios.get(`http://localhost:3002/api/assessments/${id}`);
        
        if (response.data) {
          console.log("✅ Test cargado:", response.data.title);
          setAssessment(response.data);
        }
        
      } catch (error: any) {
        console.error("❌ Error cargando test:", error);
        
        // Mensajes de error amigables
        if (error.response && error.response.status === 404) {
          setErrorMsg(`El test "${id}" no existe en la base de datos.`);
        } else {
          setErrorMsg("Error de conexión con el Assessment-Service. Revisa la consola.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  // 3. MANEJAR LA SELECCIÓN DE UNA OPCIÓN
  const handleSelectOption = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
    
    // Auto-avanzar a la siguiente pregunta
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(curr => curr + 1), 250);
    }
  };

  // 4. ENVIAR RESULTADOS
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || user?._id || 'anonimo'; 

      const payload = {
        userId: userId,
        assessmentTitle: assessment.title,
        assessmentType: id, // Guardamos qué tipo de test fue (ej: 'beck')
        totalScore: totalScore,
        maxScore: assessment.questions.length * 3, 
        answers: answers
      };

      console.log("📤 Enviando resultados:", payload);

      await axios.post('http://localhost:3002/api/assessments/results', payload);

      alert(`¡Evaluación Guardada!\nPuntaje: ${totalScore}`);
      navigate('/student/progreso'); 

    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar el resultado. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERIZADO ---
  
  if (loading) return (
    <div className="dashboard-container text-center mt-10">
      <p>Cargando evaluación...</p>
    </div>
  );

  if (errorMsg || !assessment) return (
    <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{ color: '#dc2626', marginBottom: '20px' }}>
        <AlertCircle size={48} style={{ margin: '0 auto', marginBottom: '10px' }} />
        <h3>Ups, hubo un problema</h3>
        <p>{errorMsg || "No se pudo cargar el test."}</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>ID Buscado: {id || 'undefined'}</p>
      </div>
      <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => navigate('/student/evaluaciones')}>
        Volver al menú
      </button>
    </div>
  );

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <div className="dashboard-container animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER Y PROGRESO */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>
          <span style={{ fontWeight: 'bold', color: '#0f2a4a' }}>{assessment.title}</span>
          <span>{currentQuestion + 1} / {assessment.questions.length}</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#2563eb', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* TARJETA DE PREGUNTA */}
      <div className="card" style={{ minHeight: '300px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '30px', textAlign: 'center', fontWeight: '600' }}>
          {question.text}
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {question.options.map((opt: any, idx: number) => {
            const isSelected = answers[currentQuestion] === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.value)}
                style={{
                  padding: '16px 20px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  color: isSelected ? '#1e40af' : '#475569',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '600' : '400',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {opt.label}
                {isSelected && <CheckCircle size={20} color="#2563eb" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button 
          onClick={() => setCurrentQuestion(c => Math.max(0, c - 1))}
          disabled={currentQuestion === 0}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', 
            color: currentQuestion === 0 ? '#cbd5e1' : '#64748b', 
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ArrowLeft size={20} /> Anterior
        </button>

        {currentQuestion === assessment.questions.length - 1 ? (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: 'auto', padding: '12px 30px', background: '#16a34a' }}
          >
            {submitting ? 'Guardando...' : 'Finalizar'}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestion(c => c + 1)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: '#0f2a4a', color: 'white', border: 'none', 
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
            }}
          >
            Siguiente <ArrowRight size={20} />
          </button>
        )}
      </div>

    </div>
  );
}