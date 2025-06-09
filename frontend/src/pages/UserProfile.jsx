import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/UserProfile.css';
import '../styles/AnimatedBackground.css';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Obtener información del usuario actual (logueado)
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/users/UserController.php?action=session`,
                    { withCredentials: true }
                );
                if (response.data && response.data.id) {
                    setCurrentUser(response.data);
                    // Si el usuario está viendo su propio perfil, redirigir a /perfil
                    if (response.data.id === parseInt(userId)) {
                        navigate('/perfil');
                    }
                }
            } catch (error) {
                console.log("Error al obtener la sesión:", error);
                // No redirigimos a login para permitir ver perfiles sin estar logueado
            }
        };
        
        getSession();
    }, [backendUrl, userId, navigate]);
    
    // Obtener información del usuario del perfil
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${backendUrl}/users/UserController.php?action=get&id=${userId}`,
                    { withCredentials: true }
                );
                
                if (response.data) {
                    setUser(response.data);
                } else {
                    console.error("Error: No se encontró el usuario");
                }
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            getUserProfile();
        }
    }, [userId, backendUrl]);
    
    // Obtener proyectos del usuario
    useEffect(() => {
        const getProjects = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/projects/ProjectController.php?action=getByIdUser&id=${userId}`,
                    { withCredentials: true }
                );
                
                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                } else {
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error al obtener los proyectos:", error);
                setProjects([]);
            }
        };
        
        if (userId) {
            getProjects();
        }
    }, [userId, backendUrl]);
    
    // Verificar si el usuario actual sigue al usuario del perfil
    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!currentUser || !userId) return;
            
            try {
                const response = await axios.get(
                    `${backendUrl}/follow_users/FollowUsersController.php?action=getFollowed&userId=${currentUser.id}`,
                    { withCredentials: true }
                );
                
                if (Array.isArray(response.data)) {
                    // Extraer IDs de los usuarios seguidos y verificar si el usuario actual está en la lista
                    const followedUserIds = response.data.map(user => Number(user.id));
                    console.log('Usuarios seguidos:', followedUserIds);
                    console.log('Verificando si sigue a:', parseInt(userId));
                    const isAlreadyFollowing = followedUserIds.includes(parseInt(userId));
                    setIsFollowing(isAlreadyFollowing);
                }
            } catch (error) {
                console.error("Error al verificar estado de seguimiento:", error);
            }
        };
        
        checkFollowStatus();
    }, [currentUser, userId, backendUrl]);
    
    // Obtener contadores de seguidores y seguidos
    useEffect(() => {
        const getFollowCounts = async () => {
            if (!userId) return;
            
            try {
                // Obtener número de seguidores
                const followersResponse = await axios.get(
                    `${backendUrl}/follow_users/FollowUsersController.php?action=countFollowers&userId=${userId}`,
                    { withCredentials: true }
                );
                
                if (followersResponse.data && followersResponse.data.success) {
                    setFollowersCount(followersResponse.data.count);
                }
                
                // Obtener número de seguidos
                const followingResponse = await axios.get(
                    `${backendUrl}/follow_users/FollowUsersController.php?action=countFollowing&userId=${userId}`,
                    { withCredentials: true }
                );
                
                if (followingResponse.data && followingResponse.data.success) {
                    setFollowingCount(followingResponse.data.count);
                }
            } catch (error) {
                console.error("Error al obtener conteo de seguidores:", error);
            }
        };
        
        getFollowCounts();
    }, [userId, backendUrl]);
    
    // Función para seguir/dejar de seguir al usuario
    const handleFollowToggle = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        
        setFollowLoading(true);
        const action = isFollowing ? 'unfollow' : 'follow';
        
        try {
            const response = await axios.post(
                `${backendUrl}/follow_users/FollowUsersController.php?action=${action}`,
                {
                    id_usu1: Number(currentUser.id),
                    id_usu2: Number(userId)
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (response.data.success) {
                setIsFollowing(!isFollowing);
                // Actualizar contador de seguidores
                setFollowersCount(prevCount => 
                    isFollowing ? prevCount - 1 : prevCount + 1
                );
            }
        } catch (error) {
            console.error(`Error al ${isFollowing ? 'dejar de seguir' : 'seguir'} al usuario:`, error);
        } finally {
            setFollowLoading(false);
        }
    };
    
    // Imagen de perfil predeterminada
    const getProfileImage = () => {
        if (user && user.imagen) {
            return `${backendUrl}/users/imagenes/${user.imagen}`;
        }
        
        return "https://ui-avatars.com/api/?name=" + 
            (user ? encodeURIComponent(user.username || user.user || 'User') : "User") + 
            "&background=5d4fff&color=fff&size=200";
    };
    
    return (
        <div className="user-profile-container">
            {/* Fondo animado futurista */}
            <div className="cyber-background">
                {/* Partículas */}
                <div className="particles-container">
                    {[...Array(7)].map((_, index) => (
                        <div key={index} className="particle"></div>
                    ))}
                </div>
                
                {/* Efecto de cuadrícula */}
                <div className="grid-container"></div>
                
                {/* Formas geométricas */}
                <div className="cyber-shape hexagon shape-1"></div>
                <div className="cyber-shape triangle shape-2"></div>
                <div className="cyber-shape circle shape-3"></div>
                <div className="cyber-shape rectangle shape-4"></div>
                
                {/* Líneas digitales */}
                <div className="digital-lines"></div>
            </div>
            
            <div className="content-wrapper">
                <div className="profile-header">
                    <Link to="/search" className="back-button">
                        &larr; Volver a búsqueda
                    </Link>
                    <h1>Perfil de Usuario</h1>
                </div>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="cyber-loader"></div>
                        <p>Cargando perfil...</p>
                    </div>
                ) : user ? (
                    <>
                        <div className="profile-info-container">
                            <div className="profile-card">
                                <div className="profile-image-container">
                                    <img 
                                        src={getProfileImage()} 
                                        alt={`${user.username || user.user || 'Usuario'}`}
                                        className="profile-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://ui-avatars.com/api/?name=User&background=5d4fff&color=fff&size=200";
                                        }}
                                    />
                                </div>
                                <div className="profile-details">
                                    <h2 className="username">{user.username || user.user}</h2>
                                    <p className="email">{user.email}</p>
                                    
                                    {user.descripcion && (
                                        <p className="bio">{user.descripcion}</p>
                                    )}
                                    
                                    <div className="profile-meta">
                                        <div className="meta-item">
                                            <span className="meta-value">{projects.length}</span>
                                            <span className="meta-label">Componentes</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-value">{followersCount}</span>
                                            <span className="meta-label">Seguidores</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-value">{followingCount}</span>
                                            <span className="meta-label">Siguiendo</span>
                                        </div>
                                    </div>
                                    
                                    {/* Botón de seguir/dejar de seguir */}
                                    {currentUser && currentUser.id !== parseInt(userId) && (
                                        <div className="follow-action">
                                            <button 
                                                onClick={handleFollowToggle}
                                                className={`follow-button ${isFollowing ? 'following' : ''}`}
                                                disabled={followLoading}
                                            >
                                                {followLoading ? (
                                                    <span className="loading-spinner"></span>
                                                ) : isFollowing ? (
                                                    <>
                                                        <FaUserCheck /> Siguiendo
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserPlus /> Seguir
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Sección de proyectos/componentes */}
                        <div className="profile-projects">
                            <div className="section-header">
                                <h2 className="section-title">Componentes de {user.username || user.user}</h2>
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
                                                <Link to={`/code-project/${project.id}`} className="view-project-button">
                                                    Ver Componente
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-projects">
                                    <p>Este usuario no tiene componentes publicados.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="error-message">
                        <p>No se pudo encontrar el usuario.</p>
                        <Link to="/search" className="back-button">
                            Volver a la búsqueda
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
