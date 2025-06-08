import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import '../styles/AnimatedBackground.css';

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const backgroundRef = useRef(null);

  // Generar elementos flotantes para el fondo
  useEffect(() => {
    if (backgroundRef.current) {
      const elements = backgroundRef.current.querySelectorAll('.floating-element');
      elements.forEach(element => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        element.style.setProperty('--random-x', `${randomX}%`);
        element.style.setProperty('--random-y', `${randomY}%`);
      });
    }
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e)  => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Construye el objeto con los datos a enviar
    const dataToSend = {
      user: user,
      password: password
    };

    try {
      const response = await axios.post(
        `${backendUrl}/users/UserController.php?action=login`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Importante para mantener la sesión
        }
      );

      const data = response.data;
      console.log('Respuesta de login:', data);
      
      // Verificar que la respuesta es exitosa
      if (data.success) {
        // Redirigir al usuario al Home
        navigate('/');
      } else if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Nuevo fondo animado futurista */}
      <div className="cyber-background">
        {/* Partículas */}
        <div className="particles-container">
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
      
      {/* Elementos flotantes decorativos */}
      <div className="floating-elements" ref={backgroundRef}>
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>
    
      <div className="auth-form-card">
        <h1 className="auth-title">Acceso CompoDev</h1>
        <p className="auth-subtitle">Inicia sesión para acceder a tu cuenta y gestionar tus componentes</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">Nombre de usuario</label>
            <input 
              type="text" 
              id="user"
              className="form-control"
              value={user} 
              onChange={(e) => setUser(e.target.value)} 
              required
              placeholder="Tu nombre de usuario"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password"
              id="password" 
              className="form-control"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Tu contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="auth-alternate-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  )
}

export default Login