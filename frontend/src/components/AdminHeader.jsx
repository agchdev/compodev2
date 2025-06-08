import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminHeader.css";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingUsers: 0,
    reportedProjects: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to check if the current path matches a given path
  const isActive = (path) => {
    return currentPath === path;
  };
  
  // Obtener información del usuario y estadísticas para el panel de administración
  useEffect(() => {
    // Función para obtener estadísticas del panel de administración
    const fetchAdminStats = async () => {
      try {
        // Aquí se harían llamadas a la API para obtener estadísticas
        // Por ahora, usamos datos de ejemplo
        const statsResponse = await axios.get(
          `${backendUrl}/admin/AdminController.php?action=getStats`,
          { withCredentials: true }
        );
        
        // Si hay una API implementada, usar los datos reales
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error al obtener estadísticas de administración:", error);
        // Si hay error, usamos datos de ejemplo para mostrar la interfaz
        setStats({
          pendingUsers: 3,
          reportedProjects: 5,
          unreadMessages: 8
        });
      }
    };

    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        if (userData && userData.rol === 'admin') {
          setUser(userData);
          fetchAdminStats();
        } else {
          // Si no es admin, redirigir al inicio
          navigate('/');
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [backendUrl, navigate]);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await axios.get(
        `${backendUrl}/users/UserController.php?action=logout`,
        { withCredentials: true }
      );
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  // Función para abrir y cerrar el menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="admin-header">
      {loading ? (
        <div className="admin-loading">
          <div className="admin-loader"></div>
        </div>
      ) : (
        <div className="admin-header-container">
          <div className="admin-logo">
            <Link to="/">
              <span className="admin-logo-text">Compo<span className="admin-logo-accent">Dev</span></span>
            </Link>
            <span className="admin-badge">Admin</span>
          </div>
          
          {/* Botón de menú hamburguesa para móvil */}
          <div className="admin-menu-toggle" onClick={toggleMenu}>
            <span className={`admin-menu-icon ${menuOpen ? 'open' : ''}`}></span>
          </div>
          
          <nav className={`admin-nav ${menuOpen ? 'open' : ''}`}>
            <ul className="admin-nav-links">
              <li className={isActive("/Admin-panel") ? "active" : ""}>
                <Link to="/Admin-panel">Principal</Link>
              </li>
              <li className={isActive("/Admin-users") ? "active" : ""}>
                <Link to="/Admin-users">
                  Usuarios
                  {stats.pendingUsers > 0 && (
                    <span className="admin-notification-badge">{stats.pendingUsers}</span>
                  )}
                </Link>
              </li>
              <li className={isActive("/Admin-projects") ? "active" : ""}>
                <Link to="/Admin-projects">
                  Proyectos
                  {stats.reportedProjects > 0 && (
                    <span className="admin-notification-badge">{stats.reportedProjects}</span>
                  )}
                </Link>
              </li>
              <li className={isActive("/Admin-messages") ? "active" : ""}>
                <Link to="/Admin-messages">
                  Mensajes
                  {stats.unreadMessages > 0 && (
                    <span className="admin-notification-badge">{stats.unreadMessages}</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex gap-4">
            {user && (
              <div className="admin-user-info">
                <div className="admin-profile-pic">
                  {user.urlFoto ? (
                    <img
                      src={`${backendUrl}/${user.urlFoto}`}
                      alt="Perfil"
                    />
                  ) : (
                    <div className="admin-profile-initial">{user.user.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="admin-user-name">{user.user}</div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={logout} className="admin-logout-btn">
                <span className="admin-logout-icon">⏻</span>
                <span className="admin-logout-text">Cerrar sesión</span>
              </button>
              <Link to="/" className="admin-back">
                <span className="admin-back-icon">←</span>
                <span className="admin-back-text">Volver al sitio</span>
              </Link>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default AdminHeader;
