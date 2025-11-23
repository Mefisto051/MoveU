import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activityPlans, setActivityPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Obtener perfil del usuario
        const userResponse = await api.get('/user/profile');
        setUser(userResponse.data);

        // Obtener planes de actividad
        const plansResponse = await api.get('/activityplan');
        setActivityPlans(plansResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.removeItem('accessToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">MU</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">MoveU Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <span className="text-lg">⏱️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Minutos de ejercicio semanal</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.weeklyExerciseMinutes || 0} min</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Horas frente a pantalla</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.dailyScreenTimeHours || 0} h/día</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Planes activos</p>
                  <p className="text-2xl font-bold text-gray-900">{activityPlans.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Planes de actividad */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mis Planes de Actividad</h2>
            </div>
            <div className="p-6">
              {activityPlans.length > 0 ? (
                <div className="space-y-4">
                  {activityPlans.map((plan) => (
                    <div key={plan.activityPlanId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{plan.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span>⏱️ {plan.durationMinutes} min</span>
                            <span>📊 {plan.difficulty}</span>
                            <span>📅 {new Date(plan.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Activo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes planes de actividad</h3>
                  <p className="text-gray-600 mb-4">Comienza creando tu primer plan de ejercicios.</p>
                  <button 
                    onClick={() => navigate('/create-plan')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Crear primer plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
