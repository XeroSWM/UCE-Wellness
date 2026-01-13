import { Calendar, Bell, Activity, ArrowRight, Stethoscope, Heart, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Banner de Bienvenida */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">¡Hola, Estudiante! 👋</h1>
          <p className="text-blue-100 max-w-xl text-lg mb-6">
            Bienvenido a tu plataforma de bienestar. ¿Necesitas atención médica hoy?
          </p>
          <Link to="/student/agendar" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-transform active:scale-95">
            Agendar Cita <ArrowRight size={18} />
          </Link>
        </div>
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-2xl"></div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Calendar /></div>
          <div>
            <p className="text-sm text-slate-500">Próxima Cita</p>
            <h3 className="text-xl font-bold text-slate-800">Sin agendar</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-full text-amber-600"><Bell /></div>
          <div>
            <p className="text-sm text-slate-500">Notificaciones</p>
            <h3 className="text-xl font-bold text-slate-800">2 Nuevas</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600"><Activity /></div>
          <div>
            <p className="text-sm text-slate-500">Estado</p>
            <h3 className="text-xl font-bold text-slate-800">Activo</h3>
          </div>
        </div>
      </div>

      {/* Servicios Rápidos */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Servicios Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ServiceCard icon={<Stethoscope size={32} />} title="Medicina General" desc="Atención primaria y chequeos." />
          <ServiceCard icon={<Smile size={32} />} title="Odontología" desc="Salud oral y limpiezas." />
          <ServiceCard icon={<Heart size={32} />} title="Psicología" desc="Apoyo emocional y mental." />
        </div>
      </div>
    </div>
  );
}

// Componente pequeño para las tarjetas de servicios
function ServiceCard({ icon, title, desc }: any) {
  return (
    <div className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
      <div className="mb-4 text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}