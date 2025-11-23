// src/pages/EditPlan.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditPlan = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    difficulty: 'Medium',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      console.log('📥 Cargando plan para editar:', id);
      
      // Obtener todos los planes y filtrar el que queremos editar
      const response = await api.get('/activityplan');
      const plans = response.data;
      const planToEdit = plans.find(plan => plan.activityPlanId === parseInt(id));
      
      if (planToEdit) {
        console.log('✅ Plan encontrado:', planToEdit);
        setFormData({
          title: planToEdit.title,
          description: planToEdit.description || '',
          durationMinutes: planToEdit.durationMinutes,
          difficulty: planToEdit.difficulty,
          date: new Date(planToEdit.date).toISOString().split('T')[0]
        });
      } else {
        alert('❌ Plan no encontrado');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Error cargando plan:', error);
      alert('Error al cargar el plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      console.log('📤 Actualizando plan:', { id, ...formData });
      
      const response = await api.put(`/activityplan/${id}`, formData);
      
      console.log('✅ Plan actualizado:', response.data);
      alert('🎉 ¡Plan actualizado exitosamente!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Error actualizando plan:', error);
      alert('Error al actualizar el plan. Verifica la consola para más detalles.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Plan de Actividad</h1>
          <p className="text-gray-600 mt-2">Modifica tu rutina de ejercicios</p>
        </div>

        {/* Formulario */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título del Plan *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Rutina mañanera de cardio"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe los ejercicios que incluirás en esta rutina..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duración */}
              <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  required
                  min="5"
                  max="180"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Entre 5 y 180 minutos</p>
              </div>

              {/* Dificultad */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Dificultad *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  required
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Beginner">Principiante</option>
                  <option value="Medium">Intermedio</option>
                  <option value="Advanced">Avanzado</option>
                </select>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Plan *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Actualizando...
                  </span>
                ) : (
                  'Actualizar Plan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlan;
