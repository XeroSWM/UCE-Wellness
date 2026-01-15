import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function TakingAssessmentPage() {
  const { type } = useParams(); // 'estres' o 'beck'
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        console.log("Iniciando búsqueda de test tipo:", type);
        
        // 1. Pedimos TODOS los tests al backend
        const response = await axios.get('http://localhost:3002/api/assessments');
        const allAssessments = response.data;
        
        console.log("Tests disponibles en BD:", allAssessments);

        // 2. Estrategia de búsqueda flexible (Por Título en lugar de Código)
        let found = null;

        if (type === 'estres') {
          // Busca algo que tenga "Estrés" o "PSS" en el título
          found = allAssessments.find((a: any) => 
            a.title.toLowerCase().includes('estrés') || 
            a.title.toLowerCase().includes('estres') ||
            a.title.includes('PSS')
          );
        } else if (type === 'beck') {
          // Busca algo que tenga "Beck" o "Depresión" en el título
          found = allAssessments.find((a: any) => 
            a.title.toLowerCase().includes('beck') || 
            a.title.toLowerCase().includes('depresión')
          );
        }

        if (found) {
          console.log("✅ Test encontrado:", found.title);
          setAssessment(found);
        } else {
          console.warn("❌ No se encontró ningún test compatible con:", type);
          setErrorMsg(`No se encontró el test de tipo "${type}" en la base de datos.`);
        }
        
      } catch (error: any) {
        console.error("Error de conexión:", error);
        setErrorMsg("Error al conectar con el servidor (Assessment-Service). Revisa que esté prendido en el puerto 3002.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [type]);

  // Manejo de selección
  const handleSelectOption = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
    
    // Auto-avanzar (con un pequeño delay para que se note la selección)
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setTimeout(() => setCurrentQuestion(curr => curr + 1), 250);
    }
  };

  // Enviar Resultados
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      
      // Aquí podrías guardar en el backend si tuvieras el endpoint listo
      // await axios.post('http://localhost:3002/api/results', { ... });

      alert(`¡Evaluación Completada!\n\nTu puntaje calculado es: ${totalScore}\n\n(Este resultado debería guardarse en el historial)`);
      navigate('/student/dashboard'); 
    } catch (error) {
      console.error("Error enviando:", error);
      alert("Error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERIZADO DE ESTADOS DE CARGA Y ERROR ---
  if (loading) return (
    <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Cargando evaluación...</p>
    </div>
  );

  if (errorMsg || !assessment) return (
    <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{ color: '#dc2626', marginBottom: '20px' }}>
        <AlertCircle size={48} style={{ margin: '0 auto', marginBottom: '10px' }} />
        <h3>Ups, hubo un problema</h3>
        <p>{errorMsg || "No se encontró la información del test."}</p>
      </div>
      <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => navigate('/student/evaluaciones')}>
        Volver a intentar
      </button>
    </div>
  );

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Barra de Progreso */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>
          <span style={{ fontWeight: 'bold', color: '#0f2a4a' }}>{assessment.title}</span>
          <span>Pregunta {currentQuestion + 1} de {assessment.questions.length}</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#2563eb', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Tarjeta de Pregunta */}
      <div className="card" style={{ minHeight: '400px', padding: '40px' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          color: '#1e293b', 
          marginBottom: '30px', 
          textAlign: 'center', 
          fontWeight: '600',
          lineHeight: '1.4' 
        }}>
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
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : 'none'
                }}
              >
                {opt.label}
                {isSelected && <CheckCircle size={20} color="#2563eb" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', alignItems: 'center' }}>
        <button 
          onClick={() => setCurrentQuestion(c => Math.max(0, c - 1))}
          disabled={currentQuestion === 0}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', 
            color: currentQuestion === 0 ? '#cbd5e1' : '#64748b', 
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', 
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={20} /> Anterior
        </button>

        {currentQuestion === assessment.questions.length - 1 ? (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: 'auto', padding: '12px 30px', background: '#16a34a', color: 'white' }}
          >
            {submitting ? 'Guardando...' : 'Finalizar Test'}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestion(c => Math.min(assessment.questions.length - 1, c + 1))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: '#0f2a4a', color: 'white', border: 'none', 
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Siguiente <ArrowRight size={20} />
          </button>
        )}
      </div>

    </div>
  );
}