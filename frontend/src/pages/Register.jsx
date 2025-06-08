import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import '../styles/AnimatedBackground.css';

const Register = () => {
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
    urlFoto: '',
    descripcion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlFoto, setUrlFoto] = useState('');
  const [urlFotoPhp, setUrlFotoPhp] = useState(null);
  const navigate = useNavigate();
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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFotoSeleccionada = (event) => {
    const file = event.target.files[0] // Obtiene el archivo seleccionado
    if (file) {
      setUrlFoto(URL.createObjectURL(file)) // Genera una URL temporal para previsualizar la imagen
      console.log(urlFoto)
    }
    setUrlFotoPhp(file)
    console.log(file)
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!formData.user || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos obligatorios son requeridos');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Formato de correo electrónico inválido');
      setLoading(false);
      return;
    }

    // Validar longitud de la contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Crear un objeto FormData para enviar los datos, incluyendo el archivo
      const formDataToSend = new FormData();
      
      // Agregar los datos del formulario
      formDataToSend.append('user', formData.user);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('descripcion', formData.descripcion || 'Sin descripción');
      
      // Agregar el archivo de imagen si existe
      if (urlFotoPhp) {
        formDataToSend.append('urlFoto', urlFotoPhp);
      }

      console.log('Enviando datos de formulario');

      // Enviar el FormData sin especificar Content-Type para que el navegador
      // establezca automáticamente el boundary correcto
      const response = await axios.post(
        `${backendUrl}/users/UserController.php?action=create`,
        formDataToSend
      );

      console.log('Respuesta del servidor:', response);

      // Con axios no necesitamos verificar response.ok
      // Los datos ya están en response.data
      const data = response.data;
      console.log('Datos recibidos:', data);

      // Redirigir a la página de login
      navigate('/login');
    } catch (err) {
      console.error('Error en la petición:', err);
      setError(err.message || 'Error al conectar con el servidor');
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
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Únete a la comunidad de CompoDev y comparte tus componentes</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-login-form" onSubmit={handleSubmit}>
          <img
            src={urlFoto || "/uploads/deafult.jpg"}
            alt="foto"
            className="image-preview"
          />
          <div className="file-input-container">
            <label htmlFor="profile-photo" className="file-input-label">
              Seleccionar imagen de perfil
            </label>
            <input
              id="profile-photo"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFotoSeleccionada}
            />
          </div>
          <div className="form-group">
            <label htmlFor="user">Nombre de Usuario</label>
            <input
              type="text"
              id="user"
              name="user"
              className="form-control"
              value={formData.user}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Escribe una breve descripción sobre ti"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="auth-submit-button" disabled={loading}>
            {loading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <span>Registrando cuenta...</span>
              </div>
            ) : 'Registrarse'}
          </button>
        </form>

        <div className="auth-alternate-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
