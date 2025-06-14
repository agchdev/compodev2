import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import '../styles/AnimatedBackground.css';

const AdminPanel = () => {
  const [projectStats, setProjectStats] = useState(null)
  const [messageStats, setMessageStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [userActivities, setUserActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        
        // Si el usuario no es admin, redirigirlo
        if (!userData || userData.rol !== 'admin') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        navigate('/login');
      }
    };
    
    checkAdmin();
  }, [navigate, backendUrl]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener estadísticas de proyectos
      const projectResponse = await axios.get(
        `${backendUrl}/admin_panel/AdminController.php?action=projectStats`,
        { withCredentials: true }
      );
      const projectData = projectResponse.data;
      setProjectStats(projectData);
      
      // Obtener estadísticas de mensajes
      const messageResponse = await axios.get(
        `${backendUrl}/admin_panel/AdminController.php?action=messageStats`,
        { withCredentials: true }
      );
      const messageData = messageResponse.data;
      setMessageStats(messageData);
      
      // Obtener estadísticas de usuarios
      const userResponse = await axios.get(
        `${backendUrl}/admin_panel/AdminController.php?action=userStats`,
        { withCredentials: true }
      );
      const userData = userResponse.data;
      setUserStats(userData);
      
      // Obtener actividades de usuarios
      try {
        const activitiesResponse = await axios.get(
          `${backendUrl}/actividad_usuarios/ActivityUsersController.php?action=getAll`,
          { withCredentials: true }
        );
        
        if (activitiesResponse.data && Array.isArray(activitiesResponse.data)) {
          setUserActivities(activitiesResponse.data);
        } else {
          console.warn('La respuesta de actividades no es un array:', activitiesResponse.data);
          setUserActivities([]);
        }
      } catch (activitiesError) {
        console.error('Error al cargar actividades:', activitiesError);
        setUserActivities([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar estadísticas. Por favor, inténtelo de nuevo.');
      setLoading(false);
      // Asegurarnos de que los estados tengan valores predeterminados en caso de error
      setProjectStats({});
      setMessageStats({});
      setUserStats({});
      setUserActivities([]);
    }
  }, [backendUrl]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="admin-button" onClick={fetchStats}>Reintentar</button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-container">
        {/* Fondo animado futurista */}
        <div className="cyber-background">
        {/* Partículas */}
        <div className="particles-container ">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        {/* Efecto de cuadrícula */}
        <div className="grid-container"></div>
        
        {/* Formas geométricas */}
        <div className="cyber-shape hexagon shape-1"></div>
        <div className="cyber-shape triangle shape-2"></div>
        <div className="cyber-shape circle shape-3"></div>
        <div className="cyber-shape rectangle shape-4"></div>
        
        {/* Líneas digitales */}
        <div className="digital-lines">
          <div className="h-line"></div>
          <div className="h-line"></div>
          <div className="h-line"></div>
          <div className="v-line"></div>
          <div className="v-line"></div>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Monitor de actividad y estadísticas de la plataforma</p>
      </div>
      
      <div className="stats-grid mt-20">
        <div className="stats-card">
          <h2>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            Estadísticas de Proyectos
          </h2>
          {projectStats && (
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Últimas 24 horas:</span>
                <span className="stat-value">{projectStats.last_24h}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última semana:</span>
                <span className="stat-value">{projectStats.last_week}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último mes:</span>
                <span className="stat-value">{projectStats.last_month}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último año:</span>
                <span className="stat-value">{projectStats.last_year}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="stats-card">
          <h2>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            Estadísticas de Mensajes
          </h2>
          {messageStats && (
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Últimas 24 horas:</span>
                <span className="stat-value">{messageStats.last_24h}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última semana:</span>
                <span className="stat-value">{messageStats.last_week}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último mes:</span>
                <span className="stat-value">{messageStats.last_month}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último año:</span>
                <span className="stat-value">{messageStats.last_year}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="stats-card">
          <h2>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            Estadísticas de Usuarios
          </h2>
          {userStats && (
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Últimas 24 horas:</span>
                <span className="stat-value">{userStats.last_24h}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última semana:</span>
                <span className="stat-value">{userStats.last_week}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último mes:</span>
                <span className="stat-value">{userStats.last_month}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Último año:</span>
                <span className="stat-value">{userStats.last_year}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="admin-actions">
        <button className="admin-button" onClick={fetchStats}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path>
            <path d="M13 21h6v-6"></path>
          </svg>
          Actualizar datos
        </button>
        <button className="admin-button" onClick={() => navigate('/Admin-users')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Gestionar usuarios
        </button>
        <button className="admin-button" onClick={() => navigate('/Admin-projects')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Gestionar proyectos
        </button>
        
        <button className="admin-button" onClick={() => navigate('/Admin-messages')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Gestionar Mensajes
        </button>
      </div>
      
      {/* Sección de Actividades de Usuarios */}
      <div className="activities-container">
        <h2 className="activities-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Actividades Recientes
        </h2>
        
        <div className="activities-list">
          {userActivities.length > 0 ? (
            userActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.accion === 'crear_proyecto' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    </svg>
                  ) : activity.accion === 'crear_comentario' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  )}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <span className="activity-username">{activity.username || activity.user || `Usuario ID: ${activity.id_usuario}`}</span>
                    {activity.accion === 'crear_proyecto' && ' creó un nuevo proyecto'}
                    {activity.accion === 'crear_comentario' && ' añadió un nuevo comentario'}
                    {!['crear_proyecto', 'crear_comentario'].includes(activity.accion) && ` realizó la acción: ${activity.accion}`}
                  </p>
                  <span className="activity-date">{new Date(activity.fecha).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activities">No hay actividades recientes</p>
          )}
        </div>
      </div>
      </div>
    </>
  )
}

export default AdminPanel