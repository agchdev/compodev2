import { useState, useEffect } from 'react';
import '../styles/CookieConsent.css';
import { FaShieldAlt, FaTimes, FaCookieBite } from 'react-icons/fa';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Comprobar si ya existe el consentimiento
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Mostrar después de un pequeño retraso para mejor UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setVisible(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!visible) return null;

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal">
        <div className="cookie-header">
          <div className="cookie-title">
            <FaCookieBite className="cookie-icon" />
            <h2>Política de Cookies</h2>
          </div>
          <div className="digital-circuit"></div>
        </div>
        
        <div className="cookie-content">
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestra plataforma, personalizar contenido y analizar nuestro tráfico. 
            Al continuar navegando aceptas nuestra política de cookies.
          </p>
          
          {showDetails && (
            <div className="cookie-details">
              <div className="cookie-category">
                <h3>
                  <span className="cyber-bracket">[</span> 
                  Cookies necesarias 
                  <span className="cyber-bracket">]</span>
                </h3>
                <p>Estas cookies son esenciales para el funcionamiento de la plataforma y no pueden ser deshabilitadas.</p>
              </div>
              
              <div className="cookie-category">
                <h3>
                  <span className="cyber-bracket">[</span> 
                  Cookies analíticas 
                  <span className="cyber-bracket">]</span>
                </h3>
                <p>Nos ayudan a comprender cómo interactúas con el sitio web, permitiéndonos mejorar la experiencia.</p>
              </div>
              
              <div className="cookie-category">
                <h3>
                  <span className="cyber-bracket">[</span> 
                  Cookies de marketing 
                  <span className="cyber-bracket">]</span>
                </h3>
                <p>Son utilizadas para mostrarte publicidad relevante según tus intereses y hábitos de navegación.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="cookie-actions">
          <button onClick={toggleDetails} className="cookie-button secondary">
            {showDetails ? 'Ocultar detalles' : 'Más información'}
          </button>
          <div className="cookie-primary-buttons">
            <button onClick={acceptNecessary} className="cookie-button necessary">
              <FaShieldAlt /> Solo necesarias
            </button>
            <button onClick={acceptAll} className="cookie-button accept">
              Aceptar todas
            </button>
          </div>
        </div>
        
        <button onClick={acceptNecessary} className="close-modal">
          <FaTimes />
        </button>
        
        <div className="cookie-scanline"></div>
      </div>
    </div>
  );
};

export default CookieConsent;
