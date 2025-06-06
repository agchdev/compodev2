import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateProyect = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion_proyecto: '',
        categoria: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const getSession = async () => {
          try {
            const response = await axios.get(
              `${backendUrl}/users/UserController.php?action=session`,
              { withCredentials: true }
            );
            const userData = response.data.id;
            setUser(userData);
            
          } catch (error) {
            console.log("Error al obtener la sesión:", error)
            navigate('/login');
          }
        }

        getSession()
      }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            // Crear objeto para enviar al servidor (sin confirmPassword)
            const dataToSend = {
                titulo: formData.titulo,
                descripcion_proyecto: formData.descripcion_proyecto,
                html: "",
                css: "",
                js: "",
                categoria: formData.categoria,
                user: user
            };

            console.log('Enviando datos:', dataToSend);

            // Se utiliza el nuevo formato de ruta con parámetro 'action' para evitar problemas de CORS y configuración del servidor
            // Cada controlador maneja las operaciones relacionadas con su entidad específica
            const response = await axios.post(
                `${backendUrl}/projects/ProjectController.php?action=create`,
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Respuesta del servidor:', response);

            // Con axios no necesitamos verificar response.ok
            // Los datos ya están en response.data
            const data = response.data;
            console.log('Datos recibidos:', data);

            // Redirigir a la página del home
            navigate('/code-project/' + data.proyecto.id);
        } catch (err) {
            console.error('Error en la petición:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>ZONA DE CARGA DE PROYECTOS</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="titulo">Titulo</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                        placeholder="Ingresa el titulo del proyecto"
                    />
                </div>
                <div>
                    <label htmlFor="descripcion_proyecto">Descripcion Proyecto</label>
                    <input
                        type="text"
                        id="descripcion_proyecto"
                        name="descripcion_proyecto"
                        value={formData.descripcion_proyecto}
                        onChange={handleChange}
                        required
                        placeholder="Ingresa la descripción del proyecto"
                    />
                </div>
                <div>
                    <label htmlFor="categoria">Categoria</label>
                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                        placeholder="Ingresa la categoría del proyecto"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Crear Proyecto'}
                </button>
            </form>
        </div>
    )
}

export default CreateProyect
