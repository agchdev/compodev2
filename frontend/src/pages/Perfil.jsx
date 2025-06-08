import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Perfil.css';
import '../styles/AnimatedBackground.css';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/users/UserController.php?action=session`,
                    { withCredentials: true }
                );
                const userData = response.data;
                setUser(userData);
                console.log(userData)
            } catch (error) {
                console.log("Error al obtener la sesión:", error)
                navigate('/login');
            } finally {
                setLoading(false);
            }
        }
        
        getSession()
    }, [backendUrl, navigate])

    useEffect(() => {
        if (!user) return;
        const getProjects = async () => {
            console.log(user.id)
            try {
                setLoading(true);
                const response = await axios.get(
                    `${backendUrl}/projects/ProjectController.php?action=getByIdUser&id=${user.id}`,
                    { withCredentials: true }
                );
                const ps = response.data;
                setProjects(ps);
                console.log(ps)
            } catch (error) {
                console.log("Error al obtener los proyectos:", error)
            } finally {
                setLoading(false);
            }
        }

        getProjects();
    }, [user, backendUrl])
    
    const handleDeleteProject = async (projectId) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
        
        setDeleteLoading(projectId);
        try {
            await axios.delete(
                `${backendUrl}/projects/ProjectController.php?action=delete&id=${projectId}`,
                { withCredentials: true }
            );
            
            // Actualizar la lista de proyectos eliminando el borrado
            setProjects(projects.filter(project => project.id !== projectId));
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            alert('No se pudo eliminar el proyecto. Inténtalo de nuevo.');
        } finally {
            setDeleteLoading(null);
        }
    };

    // Imagen de perfil predeterminada
    const defaultProfileImage = "https://ui-avatars.com/api/?name=" + 
        (user ? encodeURIComponent(user.user) : "User") + 
        "&background=5d4fff&color=fff&size=200";
    
    return (
        <div className="profile-container">
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
            <div className="profile-floating-elements">
                <div className="profile-floating-element profile-element-1"></div>
                <div className="profile-floating-element profile-element-2"></div>
                <div className="profile-floating-element profile-element-3"></div>
            </div>
            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                </div>
            ) : user ? (
                <>
                    {/* Header del perfil con foto e información */}
                    <div className="profile-header">
                        <div className="profile-image-container">
                            <img 
                                src={user.urlFoto || defaultProfileImage} 
                                alt={`Perfil de ${user.user}`}
                                className="profile-image"
                            />
                        </div>
                        
                        <div className="profile-details">
                            <h1 className="profile-name">{user.user}</h1>
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-description">
                                {user.descripcion || "Sin descripción. Añade una descripción para que otros usuarios conozcan más sobre ti y tus habilidades como desarrollador."}
                            </p>
                            
                            <div className="profile-meta">
                                <div className="meta-item">
                                    <span className="meta-value">{projects.length}</span>
                                    <span className="meta-label">Componentes</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-value">{user.seguidores || 0}</span>
                                    <span className="meta-label">Seguidores</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-value">{user.siguiendo || 0}</span>
                                    <span className="meta-label">Siguiendo</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-actions">
                            <Link to="/editar-perfil" className="edit-profile-button">
                                Editar Perfil
                            </Link>
                        </div>
                    </div>
                    
                    {/* Sección de proyectos */}
                    <div className="profile-projects">
                        <div className="section-header">
                            <h2 className="section-title">Mis Componentes</h2>
                            <Link to="/crearProyecto" className="create-project-button">
                                Crear Nuevo
                            </Link>
                        </div>
                        
                        {projects.length > 0 ? (
                            <div className="projects-container">
                                {projects.map((project) => (
                                    <div key={project.id} className="project-card">
                                        <h3 className="project-title">{project.titulo}</h3>
                                        <p className="project-category">Categoría: {project.categoria}</p>
                                        <p className="project-description">
                                            {project.descripcion_proyecto?.length > 100 
                                                ? `${project.descripcion_proyecto.substring(0, 100)}...` 
                                                : project.descripcion_proyecto}
                                        </p>
                                        <div className="project-actions">
                                            
                                            
                                            <div className="action-buttons">
                                                <Link to={`/code-project/${project.id}`} className="edit-button">
                                                    Editar
                                                </Link>
                                                <button 
                                                    className="delete-button"
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    disabled={deleteLoading === project.id}
                                                >
                                                    {deleteLoading === project.id ? '...' : 'Borrar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-projects">
                                <p>No has creado ningún componente todavía.</p>
                                <p>¡Comienza creando tu primer componente!</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <p>Error al cargar el perfil. Por favor, inicia sesión nuevamente.</p>
            )}
        </div>
    )
}

export default Perfil
