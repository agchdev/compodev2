import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import SlidingBanner from '../components/SlidingBanner';

const Home = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const featuredComponents = [
    {
      id: 1,
      title: 'Animated Card Slider',
      author: 'maria_dev',
      likes: 245,
      downloads: 1.2,
      image: 'https://via.placeholder.com/300x200/252836/5d4fff?text=Card+Slider'
    },
    {
      id: 2,
      title: 'Responsive Navbar',
      author: 'code_master',
      likes: 198,
      downloads: 0.9,
      image: 'https://via.placeholder.com/300x200/252836/ff4f9b?text=Responsive+Nav'
    },
    {
      id: 3,
      title: 'Particle Background',
      author: 'web_wizard',
      likes: 312,
      downloads: 1.7,
      image: 'https://via.placeholder.com/300x200/252836/4fffb5?text=Particles'
    }
  ]
 
  // Obtener usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=top_users&limit=8`,
          { withCredentials: true }
        );
        
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
      }
    }

    getSession()
  }, [backendUrl])

  const logout = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/UserController.php?action=logout`,
        { withCredentials: true }
      );
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.log("Error al cerrar sesión:", error)
    }
  }

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Compo<span className="accent">Dev</span></h1>
            <p className="hero-subtitle">Crea, comparte y descubre componentes web</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1,240+</span>
                <span className="stat-label">Componentes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">93%</span>
                <span className="stat-label">Rendimiento</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/crearProyecto" className="btn btn-primary">CREAR COMPONENTE</Link>
              <Link to="/Search" className="btn btn-secondary">EXPLORAR</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="abstract-shape"></div>
          </div>
        </div>
        <div className="hero-categories">
          <span>Interfaces</span>
          <span>Animaciones</span>
          <span>Formularios</span>
          <span>Gráficos</span>
          <span>Navegación</span>
          <span>Cards</span>
        </div>
      </section>
      
      {/* Sliding Banner between main sections */}
      <SlidingBanner text="COMPODEV" />

      {/* Services Section */}
      <section className="services-section">
        <h2>Nuestros Servicios</h2>
        <div className="services-container">
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5l9 4-9 4-9-4 9-4zm0 8v6M3 9v6l9 4 9-4V9" />
              </svg>
            </div>
            <h3>Creación de Componentes</h3>
            <p>Desarrolla componentes web reutilizables con HTML, CSS y JavaScript en nuestro editor integrado</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 9l4-4 4 4m-4-4v14" />
              </svg>
            </div>
            <h3>Publicación de Proyectos</h3>
            <p>Comparte tus creaciones con la comunidad y construye tu portfolio profesional</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3>Descubrimiento</h3>
            <p>Explora miles de componentes creados por desarrolladores de todo el mundo</p>
          </div>
        </div>
      </section>

      {/* Featured Components */}
      <section className="featured-section">
        <h2>Componentes Destacados</h2>
        <div className="featured-components">
          {featuredComponents.map(component => (
            <div key={component.id} className="component-card">
              <div className="component-image" style={{ backgroundImage: `url(${component.image})` }}></div>
              <div className="component-details">
                <h3>{component.title}</h3>
                <p>por {component.author}</p>
                <div className="component-stats">
                  <span>{component.likes} Me gusta</span>
                  <span>{component.downloads}K Descargas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <Link to="/Search" className="btn btn-outline">Ver más componentes</Link>
        </div>
      </section>

      {/* Algunos usuarios - Estilo futurista Web3 */}
      <section className="users-showcase-section">
        <h2>Algunos Usuarios</h2>
        <div className="users-grid">
          {loadingUsers ? (
            <div className="loading-users">
              <div className="cyber-spinner"></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {/* Mostrar inicial del correo o usar imagen de usuario si está disponible */}
                  {user.email && user.email.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.email ? user.email.split('@')[0] : 'Usuario'}</h3>
                  <p className="user-stats">{user.proyectos || 0} Proyectos</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-block">
          <h3>7.5M+</h3>
          <p>Usuarios</p>
        </div>
        <div className="stat-block">
          <h3>25K+</h3>
          <p>Componentes</p>
        </div>
        <div className="stat-block">
          <h3>89%</h3>
          <p>Retención</p>
        </div>
        <div className="stat-block">
          <h3>12.3%</h3>
          <p>Crecimiento</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>CompoDev</h3>
            <p>Creado por Alejandro Aguayo</p>
            <p>Una plataforma para desarrolladores web que buscan crear y compartir componentes reutilizables.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Plataforma</h4>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/Search">Explorar</Link></li>
                <li><Link to="/crearProyecto">Crear</Link></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Cuenta</h4>
              <ul>
                {user ? (
                  <>
                    <li><Link to="/perfil">Mi Perfil</Link></li>
                    <li><Link to="/editar-perfil">Configuración</Link></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Cerrar Sesión</a></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                    <li><Link to="/register">Registrarse</Link></li>
                    <li><Link to="/suscripciones">Planes Premium</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 CompoDev. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home