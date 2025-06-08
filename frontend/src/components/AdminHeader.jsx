import { Link, useLocation } from "react-router-dom";
import "../styles/AdminHeader.css";

const AdminHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if the current path matches a given path
  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <div className="admin-header">
      <div className="admin-header-container">
        <div className="admin-logo">
          <Link to="/">
            <span className="admin-logo-text">Compo<span className="admin-logo-accent">Dev</span></span>
          </Link>
          <span className="admin-badge">Admin</span>
        </div>
        
        <nav className="admin-nav">
          <ul className="admin-nav-links">
            <li className={isActive("/Admin-panel") ? "active" : ""}>
              <Link to="/Admin-panel">Panel Principal</Link>
            </li>
            <li className={isActive("/Admin-users") ? "active" : ""}>
              <Link to="/Admin-users">Gestionar Usuarios</Link>
            </li>
            <li className={isActive("/Admin-projects") ? "active" : ""}>
              <Link to="/Admin-projects">Gestionar Proyectos</Link>
            </li>
            <li className={isActive("/Admin-messages") ? "active" : ""}>
              <Link to="/Admin-messages">Mensajes</Link>
            </li>
          </ul>
        </nav>

        <div className="admin-tools">
          <Link to="/" className="admin-back">
            <span className="admin-back-icon">←</span>
            <span className="admin-back-text">Volver al sitio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
