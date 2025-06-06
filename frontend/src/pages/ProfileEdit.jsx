import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
    <section>
      {user ? (
        
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        
        <div>
          {urlFoto && (
            <img 
              src={urlFoto} 
              alt="Foto de perfil" 
              style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '10px' }} 
            />
          )}
          <label htmlFor="urlFoto">Actualizar foto de perfil</label>
          <input type="file" name="urlFoto" onChange={handleFotoSeleccionada} accept="image/*" />
        </div>
        
        <div>
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
        
        <div>
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
        
        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            name="descripcion" 
            id="descripcion"
            value={formData.descripcion} 
            onChange={handleChange} 
            rows="3"
          />
        </div>
        
        <div>
          <h3>Cambiar contraseña (opcional)</h3>
          <label htmlFor="password">Nueva contraseña</label>
          <input 
            type="password" 
            name="password" 
            id="password"
            value={formData.password} 
            onChange={handleChange} 
          />
          
          <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
          <input 
            type="password" 
            name="confirmPassword" 
            id="confirmPassword"
            value={formData.confirmPassword} 
            onChange={handleChange} 
          />
          <small>Deja en blanco para mantener la contraseña actual</small>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando perfil...' : 'Guardar cambios'}
        </button>
      </form>
      ):(
        <p>Cargando datos del perfil...</p>
      )}
    </section>
  )
}

export default ProfileEdit
