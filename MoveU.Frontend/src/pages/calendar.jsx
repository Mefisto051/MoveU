// src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

// Configuración de localización
const localizer = momentLocalizer(moment);

// Traducciones al español
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay planes en este rango',
  showMore: total => `+${total} más`
};

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/activityplan');
      const plans = response.data;
      
      // Convertir planes a eventos del calendario
      const calendarEvents = plans.map(plan => ({
        id: plan.activityPlanId,
        title: plan.title,
        start: new Date(plan.date),
        end: new Date(new Date(plan.date).getTime() + plan.durationMinutes * 60000),
        allDay: false,
        resource: plan
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error cargando planes para el calendario:', error);
      alert('Error al cargar los planes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    // Al hacer clic en un evento, ir a editar el plan
    navigate(`/edit-plan/${event.id}`);
  };

  const handleSelectSlot = ({ start }) => {
    // Al hacer clic en un slot vacío, crear nuevo plan con esa fecha
    const formattedDate = start.toISOString().split('T')[0];
    navigate('/create-plan', { 
      state: { preselectedDate: formattedDate } 
    });
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Color por defecto
    
    // Colores diferentes según la dificultad
    if (event.resource) {
      switch (event.resource.difficulty) {
        case 'Beginner':
          backgroundColor = '#10B981'; // Verde
          break;
        case 'Advanced':
          backgroundColor = '#EF4444'; // Rojo
          break;
        default:
          backgroundColor = '#3B82F6'; // Azul
      }
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        padding: '2px 8px',
        fontSize: '14px',
        fontWeight: '500'
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Volver al Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Calendario de Actividad</h1>
              <p className="text-gray-600 mt-2">Visualiza y gestiona tus planes de ejercicio</p>
            </div>
            <button 
              onClick={() => navigate('/create-plan')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Nuevo Plan
            </button>
          </div>
        </div>

        {/* Leyenda de colores */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Leyenda:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Principiante</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Intermedio</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Avanzado</span>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white shadow rounded-lg p-6">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              messages={messages}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              defaultView="month"
              popup
              step={30}
              showMultiDayTimes
              className="h-full"
            />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 Cómo usar el calendario:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Clic en un plan</strong> para editarlo</li>
            <li>• <strong>Clic en una fecha/hora vacía</strong> para crear un nuevo plan</li>
            <li>• <strong>Usa los botones</strong> para cambiar entre vista mes/semana/día</li>
            <li>• <strong>Colores</strong> indican la dificultad del plan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
