import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaGithub, FaTwitter, FaInstagram, FaCode, FaHome, FaSearch, FaUser, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const [user, setUser] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        console.log("Error al obtener la sesión:", error);
      }
    };

    getSession();
  }, [backendUrl]);

  const logout = async () => {
    try {
      await axios.get(
        `${backendUrl}/users/UserController.php?action=logout`,
        { withCredentials: true }
      );
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <footer className="cyber-footer">
      {/* Grid lines animation */}
      <div className="grid-lines">
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
      </div>
      
      {/* Logo and glowing border */}
      <div className="footer-header">
        <div className="cyber-logo">
          <span className="logo-glitch" data-text="CompoDev">CompoDev</span>
          <div className="logo-scanline"></div>
        </div>
        
        <div className="circuit-lines">
          <div className="circuit-line"></div>
          <div className="circuit-dot"></div>
          <div className="circuit-line"></div>
        </div>
      </div>

      <div className="footer-content">
        {/* Company info with cyber styling */}
        <div className="footer-info">
          <h3><span className="cyber-bracket">[</span> Sobre Nosotros <span className="cyber-bracket">]</span></h3>
          <p className="cyber-text">El futuro del desarrollo web compartido. Una plataforma para desarrolladores que buscan crear y compartir componentes reutilizables.</p>
          <div className="cyber-social">
            <a href="#" className="social-icon"><FaGithub /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
          </div>
        </div>

        {/* Links with icons */}
        <div className="footer-links">
          <div className="link-column">
            <h4><span className="cyber-bracket">[</span> Plataforma <span className="cyber-bracket">]</span></h4>
            <ul>
              <li><Link to="/"><FaHome /> Inicio</Link></li>
              <li><Link to="/Search"><FaSearch /> Explorar</Link></li>
              <li><Link to="/crearProyecto"><FaCode /> Crear</Link></li>
            </ul>
          </div>
          
          <div className="link-column">
            <h4><span className="cyber-bracket">[</span> Cuenta <span className="cyber-bracket">]</span></h4>
            <ul>
              {user ? (
                <>
                  <li><Link to="/perfil"><FaUser /> Mi Perfil</Link></li>
                  <li><Link to="/editar-perfil"><FaCog /> Configuración</Link></li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                      <FaSignOutAlt /> Cerrar Sesión
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login"><FaSignInAlt /> Iniciar Sesión</Link></li>
                  <li><Link to="/register"><FaUserPlus /> Registrarse</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Digital signature with animation */}
      <div className="footer-signature">
        <div className="data-line"></div>
        <p className="copyright">
          <span className="cyber-code">{`/* © ${new Date().getFullYear()} CompoDev • Todos los derechos reservados */`}</span>
        </p>
        <div className="data-line"></div>
      </div>
    </footer>
  );
};

export default Footer;
