import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="register-container">
      <div className="register-card">
        <h2>Crear Cuenta</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <img
            src={urlFoto || "/uploads/deafult.jpg"}
            alt="foto"
            className="w-50 h-50 rounded-3xl mb-4 object-cover"
          />
          <div className="form-group">
            <input
              className='py-2 px-4 rounded-2xl '
              type="file"
              accept="image/*"
              onChange={handleFotoSeleccionada}
            />
          </div>
          <div className="form-group">
            <label htmlFor="user">Nombre de usuario</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingresa tu email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
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
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Escribe una breve descripción sobre ti"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>

      {/* Estilos aplicados como objeto de estilo en línea */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 20px;
        }
        
        .register-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 500px;
        }
        
        h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        input, textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          font-family: inherit;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        
        textarea {
          resize: vertical;
        }
        
        .register-button {
          width: 100%;
          padding: 12px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .register-button:hover {
          background-color: #3a7bc8;
        }
        
        .register-button:disabled {
          background-color: #a0c1e8;
          cursor: not-allowed;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        
        .login-link a {
          color: #4a90e2;
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-link a:hover {
          text-decoration: underline;
        }
      `}} />
    </div>
  );
};

export default Register;
