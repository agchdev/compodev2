import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/CreateProject.css';

const CreateProyect = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion_proyecto: '',
        categoria: 'UI/UX'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [particlesGenerated, setParticlesGenerated] = useState(false);
    const backgroundRef = useRef(null);
    const navigate = useNavigate();
    
    // Categorías predefinidas para componentes
    const categories = [
        { id: 'ui-ux', name: 'UI/UX' },
        { id: 'animation', name: 'Animación' },
        { id: 'navigation', name: 'Navegación' },
        { id: 'form', name: 'Formularios' },
        { id: 'cards', name: 'Cards' },
        { id: 'buttons', name: 'Botones' },
        { id: 'charts', name: 'Gráficos' },
        { id: 'tables', name: 'Tablas' },
        { id: 'layouts', name: 'Layouts' },
        { id: 'effects', name: 'Efectos' },
    ];

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Generar partículas para el fondo animado
    useEffect(() => {
        if (!particlesGenerated && backgroundRef.current) {
            const particlesContainer = backgroundRef.current.querySelector('.particles');
            if (particlesContainer) {
                for (let i = 0; i < 20; i++) {
                    const size = Math.random() * 30 + 5;
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
                    particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particlesContainer.appendChild(particle);
                }
                setParticlesGenerated(true);
            }
        }
    }, [particlesGenerated]);

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
        
        // Limpiar mensajes al modificar el formulario
        if (error) setError('');
        if (success) setSuccess('');
    };
    
    // Seleccionar categoría
    const handleCategorySelect = (category) => {
        setFormData({
            ...formData,
            categoria: category
        });
        
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validaciones básicas
        if (!formData.titulo.trim()) {
            setError('El título es obligatorio');
            return;
        }
        
        if (!formData.descripcion_proyecto.trim()) {
            setError('La descripción es obligatoria');
            return;
        }
        
        if (!formData.categoria.trim()) {
            setError('Debes seleccionar una categoría');
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

            // Mostrar mensaje de éxito
            setSuccess('¡Proyecto creado con éxito!');

            // Redirigir a la página del proyecto después de un breve delay
            setTimeout(() => {
                navigate('/code-project/' + data.proyecto.id);
            }, 1500);
        } catch (err) {
            console.error('Error en la petición:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-project-container">
            {/* Fondo animado */}
            <div className="animated-background" ref={backgroundRef}>
                <div className="particles"></div>
            </div>
            
            <div className="create-project-content ">
                <div className="create-project-header mt-10">
                    <h1>Crear Componente</h1>
                    <p>Comparte tu creatividad con el mundo. Crea un nuevo componente para la comunidad CompoDev.</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form className="create-project-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="titulo">Título del Componente</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="form-control"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Animated Dropdown Menu"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="descripcion_proyecto">Descripción</label>
                        <textarea
                            id="descripcion_proyecto"
                            name="descripcion_proyecto"
                            className="form-control"
                            value={formData.descripcion_proyecto}
                            onChange={handleChange}
                            required
                            placeholder="Describe tu componente, sus características y casos de uso..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Categoría</label>
                        <div className="category-selector">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`category-option ${formData.categoria === category.name ? 'selected' : ''}`}
                                    onClick={() => handleCategorySelect(category.name)}
                                >
                                    <span>{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="loading-container">
                                    <div className="loader"></div>
                                    <span>Creando componente...</span>
                                </div>
                            </>
                        ) : 'Crear Componente'}
                    </button>
                </form>
            </div>
            
        </div>
    )
}

export default CreateProyect
