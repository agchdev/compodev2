import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e)  => {
    e.preventDefault();
    setError('');
  
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
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Iniciar sesión</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}

export default Login