
import { Link } from 'react-router-dom'
import '../styles/Home.css'

const Home = () => {

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
            <div className="abstract-shape">
              <img src="/code-components.svg" alt="Componentes web" className="shape-overlay" />
              <div className="tech-icons">
                <img src="/html.png" alt="HTML" className="tech-icon" />
                <img src="/css.png" alt="CSS" className="tech-icon" />
                <img src="/js.png" alt="JavaScript" className="tech-icon" />
                <img src="/react.png" alt="React" className="tech-icon" />
              </div>
            </div>
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
      

      {/* Services Section - Cyberpunk Style */}
      <section className="services-section">
        <div className="service-header">
          <h2>Nuestros <span className="text-gradient">Servicios</span></h2>
          <div className="cyber-line"></div>
          <p className="service-subtitle">Soluciones de vanguardia para desarrolladores del futuro</p>
        </div>
        
        <div className="cyber-services-container">
          <div className="cyber-service-card">
            <div className="cyber-service-glow"></div>
            <div className="service-number">01</div>
            <div className="cyber-service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5l9 4-9 4-9-4 9-4zm0 8v6M3 9v6l9 4 9-4V9" />
              </svg>
            </div>
            <div className="cyber-service-content">
              <h3>Creación de<br/>Componentes</h3>
              <div className="cyber-divider"></div>
              <p>Desarrolla componentes web con nuestro sistema de edición neuronal con tecnología de sincronización en tiempo real</p>
            </div>
            <div className="cyber-service-footer">
              <div className="tech-tag">HTML</div>
              <div className="tech-tag">CSS</div>
              <div className="tech-tag">JS</div>
            </div>
          </div>
          
          <div className="cyber-service-card">
            <div className="cyber-service-glow"></div>
            <div className="service-number">02</div>
            <div className="cyber-service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 9l4-4 4 4m-4-4v14" />
              </svg>
            </div>
            <div className="cyber-service-content">
              <h3>Publicación de<br/>Proyectos</h3>
              <div className="cyber-divider"></div>
              <p>Comparte tus creaciones en nuestra red neural distribuida con verificación de autenticidad mediante blockchain</p>
            </div>
            <div className="cyber-service-footer">
              <div className="tech-tag">NFT</div>
              <div className="tech-tag">Cloud</div>
              <div className="tech-tag">Sync</div>
            </div>
          </div>
          
          <div className="cyber-service-card">
            <div className="cyber-service-glow"></div>
            <div className="service-number">03</div>
            <div className="cyber-service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="cyber-service-content">
              <h3>Búsqueda<br/>Inteligente</h3>
              <div className="cyber-divider"></div>
              <p>Algoritmo de búsqueda cuántica que encuentra exactamente lo que necesitas antes de que lo sepas</p>
            </div>
            <div className="cyber-service-footer">
              <div className="tech-tag">AI</div>
              <div className="tech-tag">Neural</div>
              <div className="tech-tag">Quantum</div>
            </div>
          </div>
        </div>
      </section>


      {/* Reseñas de Usuarios */}
      <section className="user-reviews-section">
        <h2>Lo que dicen nuestros <span className="text-gradient">usuarios</span></h2>
        <div className="cyber-line"></div>
        
        <div className="reviews-container">
          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar" style={{ backgroundColor: "#4834c9" }}>NS</div>
              <div>
                <h4>NeuroSlicer</h4>
                <div className="rating">
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                </div>
              </div>
            </div>
            <p className="review-text">&ldquo;La plataforma revolucionó mi forma de programar. Los componentes son impresionantes y ahorran horas de trabajo. La cibernética en su máxima expresión.&rdquo;</p>
            <div className="review-footer">
              <span className="review-date">18 mayo, 2025</span>
            </div>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar" style={{ backgroundColor: "#5d4fff" }}>KR</div>
              <div>
                <h4>Kira_Render</h4>
                <div className="rating">
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            <p className="review-text">&ldquo;Como diseñadora de interfaces neurales, encontré exactamente lo que necesitaba. La integración es perfecta y el soporte técnico responde en segundos.&rdquo;</p>
            <div className="review-footer">
              <span className="review-date">3 abril, 2025</span>
            </div>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar" style={{ backgroundColor: "#7a6fff" }}>VX</div>
              <div>
                <h4>VoidXcoder</h4>
                <div className="rating">
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star half-filled">★</span>
                </div>
              </div>
            </div>
            <p className="review-text">&ldquo;Después de digitalizar mi conciencia, CompoNet fue mi primera elección para desarrollar mi plataforma. Eficiencia cuántica y diseños de otro nivel.&rdquo;</p>
            <div className="review-footer">
              <span className="review-date">27 marzo, 2025</span>
            </div>
          </div>
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


    </div>
  )
}

export default Home