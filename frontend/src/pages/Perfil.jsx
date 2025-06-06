import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);

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
            }
        }
        
        getSession()
    }, [])

    useEffect(() => {
        if (!user) return;
        const getProjects = async () => {
            console.log(user.id)
            try {
                const response = await axios.get(
                    `${backendUrl}/projects/ProjectController.php?action=getByIdUser&id=${user.id}`,
                    { withCredentials: true }
                );
                const ps = response.data;
                setProjects(ps);
                console.log(ps)
            } catch (error) {
                console.log("Error al obtener los proyectos:", error)
            }
        }

        getProjects();
    }, [user])
    
    return (
        <div>
            {user ? (
                <div>
                    <h3>Perfil de {user.user}</h3>
                    <Link to="/editar-perfil">Editar Perfil</Link>
                <h3>Proyectos</h3>
                {projects.length > 0 ? (
                    <div className="projects-grid">
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
                                    <Link to={`/code-project/${project.id}`} className="view-button">
                                        Ver Proyecto
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">No se encontraron proyectos</div>
                )}
            </div>
            ) : (
                <p>Cargando datos del perfil...</p>
            )}
        </div>
    )
}

export default Perfil
