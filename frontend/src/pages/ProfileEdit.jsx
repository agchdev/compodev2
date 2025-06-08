import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import '../styles/ProfileEdit.css';
import '../styles/AnimatedBackground.css';

const ProfileEdit = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
    urlFoto: '',
    descripcion: ''
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlFoto, setUrlFoto] = useState('');
  const [urlFotoPhp, setUrlFotoPhp] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        setUser(userData);
        
        // Inicializar el formulario con los datos del usuario
        setFormData({
          user: userData.user || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          descripcion: userData.descripcion || ''
        });
        
        // Si hay una URL de foto, mostrarla
        if (userData.urlFoto) {
          setUrlFoto(`${backendUrl}/${userData.urlFoto}`);
        }
        
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
        navigate('/login');
      }
    };

    getSession();
  }, [navigate, backendUrl])

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
    if (!formData.user || !formData.email) {
      setError('El nombre de usuario y el email son requeridos');
      setLoading(false);
      return;
    }

    // Si se ingresó una contraseña, validarla
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Validar longitud de la contraseña
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Formato de correo electrónico inválido');
      setLoading(false);
      return;
    }

    try {
      if (!user || !user.id) {
        setError('No se puede actualizar el perfil porque no hay usuario logueado');
        setLoading(false);
        return;
      }

      // Crear un objeto FormData para enviar los datos, incluyendo el archivo
      const formDataToSend = new FormData();
      
      // Agregar los datos del formulario
      formDataToSend.append('id', user.id); // Importante: ID del usuario a actualizar
      formDataToSend.append('user', formData.user);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('descripcion', formData.descripcion || 'Sin descripción');
      
      // Agregar contraseña solo si se modificó
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      // Agregar el archivo de imagen si existe
      if (urlFotoPhp) {
        formDataToSend.append('urlFoto', urlFotoPhp);
      }

      console.log('Enviando datos de formulario');

      // Enviar el FormData sin especificar Content-Type para que el navegador
      // establezca automáticamente el boundary correcto
      const response = await axios.post(
        `${backendUrl}/users/UserController.php?action=update`,
        formDataToSend,
        { withCredentials: true }
      );

      console.log('Respuesta del servidor:', response);

      // Con axios no necesitamos verificar response.ok
      // Los datos ya están en response.data
      const data = response.data;
      console.log('Datos recibidos:', data);

      // Redirigir a la página del perfil
      navigate('/perfil');
    } catch (err) {
      console.error('Error en la petición:', err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-container">
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
      
      {loading && !user ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : user ? (
        <div className="profile-edit-card mt-20">
          <h2 className="profile-edit-title">Editar Perfil</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="profile-image-preview">
              <div className="profile-image-container">
                <img 
                  src={urlFoto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.user) + "&background=5d4fff&color=fff&size=200"} 
                  alt={`Foto de perfil de ${formData.user}`} 
                  className="profile-image"
                />
              </div>
              
              <div className="file-upload-container">
                <label className="file-upload-btn">
                  Actualizar foto
                  <input 
                    type="file" 
                    name="urlFoto" 
                    className="file-upload-input"
                    onChange={handleFotoSeleccionada} 
                    accept="image/*" 
                  />
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="user">Nombre de usuario</label>
              <input 
                type="text" 
                name="user" 
                id="user"
                value={formData.user} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email"
                value={formData.email} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                name="descripcion" 
                id="descripcion"
                value={formData.descripcion} 
                onChange={handleChange} 
                rows="4"
                placeholder="Cuéntanos un poco sobre ti..."
              />
            </div>
            
            <div className="password-section">
              <h3 className="password-title">Cambiar contraseña (opcional)</h3>
              
              <div className="form-group">
                <label htmlFor="password">Nueva contraseña</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="********"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="********"
                />
                <small>Deja en blanco para mantener la contraseña actual</small>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Actualizando perfil...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
              
              <Link to="/perfil" className="back-link" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#8c7dff', textDecoration: 'none' }}>
                Volver al perfil
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="error-container">
          <p>Error al cargar los datos del perfil. Por favor, inicia sesión nuevamente.</p>
          <Link to="/login" className="submit-button" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Ir a Login</Link>
        </div>
      )}
      
    </div>
  )
}

export default ProfileEdit
