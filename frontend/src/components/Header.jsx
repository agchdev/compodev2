import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../styles/Header.css"
import AdminHeader from "./AdminHeader"

const Header = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  // No longer need adminMenuOpen state as we'll use CSS hover
  // const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        console.log(userData)
        setUser(userData);
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
      }
    }

    getSession()
  }, [backendUrl])

  const logout = async () => {
    try {
      await axios.get(
        `${backendUrl}/users/UserController.php?action=logout`,
        { withCredentials: true }
      );
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log("Error al cerrar sesión:", error)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Cierra los otros menús cuando se abre/cierra el menú principal
    setProfileMenuOpen(false);
    // No longer need to set adminMenuOpen
  }

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setProfileMenuOpen(!profileMenuOpen);
    // No longer need to set adminMenuOpen
  }

  // No longer needed as we'll use CSS hover
  // const toggleAdminMenu = (e) => {
  //   e.stopPropagation();
  //   setAdminMenuOpen(!adminMenuOpen);
  //   setProfileMenuOpen(false);
  // }

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const closeMenus = () => {
      setProfileMenuOpen(false);
      // No longer need to set adminMenuOpen
    };

    document.addEventListener('click', closeMenus);

    return () => {
      document.removeEventListener('click', closeMenus);
    };
  }, []);

  // Si el usuario es admin, mostrar el AdminHeader en lugar del header normal
  if (user && user.rol === 'admin') {
    return <AdminHeader />;
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-text">Compo<span className="logo-accent">Dev</span></span>
          </Link>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </div>

        {/* Navigation Links */}
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Search">Explorar</Link></li>
            <li><Link to="/crearProyecto">Crear</Link></li>
            <li><Link to="/suscripciones">Premium</Link></li>
            {user && user.verificado === 1 && (
              <li><Link to="/foro">Foro</Link></li>
            )}
          </ul>
        </nav>

        {/* User Profile / Auth Actions */}
        <div className="auth-container">
          {user ? (
            <div className="user-profile" onClick={toggleProfileMenu}>
              <div className="profile-pic">
                {user.urlFoto ? (
                  <img
                    src={`${backendUrl}/${user.urlFoto}`}
                    alt="Perfil"
                  />
                ) : (
                  <div className="profile-initial">{user.user.charAt(0).toUpperCase()}</div>
                )}
              </div>
              {profileMenuOpen && (
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  
                  <ul className="profile-menu">
                    <li>
                      <Link to="/perfil">
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link to="/editar-perfil">
                        Configuración
                      </Link>
                    </li>
                    {user.rol === 'admin' && (
                      <li className="admin-dropdown-trigger">
                        <span>
                          Panel de Administración
                        </span>
                        <span className="dropdown-icon">▶</span>
                        <ul className="admin-dropdown">
                          <li><Link to="/Admin-panel">Panel Principal</Link></li>
                          <li><Link to="/Admin-users">Gestionar Usuarios</Link></li>
                          <li><Link to="/Admin-projects">Gestionar Proyectos</Link></li>
                          <li><Link to="/Admin-messages">Mensajes</Link></li>
                        </ul>
                      </li>
                    )}
                    <li className="profile-menu-item logout-item" onClick={logout}>
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header
