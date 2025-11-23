import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    age: '',
    gender: '',
    email: '',
    weeklyExerciseMinutes: 0,
    dailyScreenTimeHours: 0,
    doesActiveBreaks: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      console.log('📤 Enviando datos de perfil:', user);
      
      // ✅ ESTA LLAMADA FUNCIONARÁ CUANDO EL BACKEND ESTÉ LISTO
      const response = await api.put('/user/profile', user);
      
      console.log('✅ Perfil actualizado:', response.data);
      alert('🎉 ¡Perfil actualizado exitosamente!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      
      if (error.response?.status === 404) {
        alert('⚠️ El endpoint de actualización no está disponible aún. El backend necesita ser actualizado.');
      } else {
        alert('Error al actualizar el perfil. Verifica la consola para más detalles.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Actualiza tu información personal y preferencias</p>
        </div>

        {/* Formulario de Perfil */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre Completo */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={user?.fullName || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={user?.email || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Edad */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Edad *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    min="16"
                    max="100"
                    value={user?.age || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Género */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Género *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={user?.gender || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preferencias de Ejercicio */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias de Ejercicio</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minutos semanales de ejercicio */}
                <div>
                  <label htmlFor="weeklyExerciseMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta semanal de ejercicio (minutos)
                  </label>
                  <input
                    type="number"
                    id="weeklyExerciseMinutes"
                    name="weeklyExerciseMinutes"
                    min="0"
                    max="1000"
                    value={user?.weeklyExerciseMinutes || 0}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recomendado: 150 min/semana</p>
                </div>

                {/* Horas diarias frente a pantalla */}
                <div>
                  <label htmlFor="dailyScreenTimeHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Horas diarias frente a pantalla
                  </label>
                  <input
                    type="number"
                    id="dailyScreenTimeHours"
                    name="dailyScreenTimeHours"
                    min="0"
                    max="24"
                    value={user?.dailyScreenTimeHours || 0}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Pausas activas */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="doesActiveBreaks"
                    checked={user?.doesActiveBreaks || false}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Realizar pausas activas durante el estudio/trabajo
                  </span>
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
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
                    Guardando...
                  </span>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
