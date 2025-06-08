import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Search.css';
import '../styles/AnimatedBackground.css';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

export default function Search() {
  // Estado para proyectos
  const [projects, setProjects] = useState([]);
  const [projectsCurrentPage, setProjectsCurrentPage] = useState(1);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  
  // Estado para usuarios
  const [users, setUsers] = useState([]);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  
  // Estado compartido
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('projects'); // 'projects' o 'users'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para seguimiento de usuarios
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followLoading, setFollowLoading] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Función para buscar proyectos
  const fetchProjects = async (page, term) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${backendUrl}/projects/ProjectController.php?action=all&page=${page}${term ? `&search=${term}` : ''}`;
      const response = await axios.get(url, { withCredentials: true });
      
      // Verificamos si la respuesta tiene el formato esperado
      if (response.data && response.data.projects) {
        setProjects(response.data.projects);
        
        // Usar la información de paginación proporcionada por el backend
        if (response.data.pagination) {
          setProjectsTotalPages(response.data.pagination.totalPages);
        } else {
          setProjectsTotalPages(1);
        }
      } else {
        // Si el formato es distinto, usar el array completo como en versiones anteriores
        if (Array.isArray(response.data)) {
          setProjects(response.data);
          setProjectsTotalPages(1); // Sin información de paginación
        } else {
          setProjects([]);
          setProjectsTotalPages(1);
          console.warn('Formato de respuesta inesperado para proyectos:', response.data);
        }
      }
    } catch (err) {
      console.error('Error al buscar proyectos:', err);
      setError('No se pudieron cargar los proyectos. Por favor, intenta de nuevo.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener los usuarios que sigue el usuario actual
  const fetchFollowedUsers = async (userId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/UserController.php?action=getFollowed&userId=${userId}`,
        { withCredentials: true }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setFollowedUsers(response.data.map(user => user.usuario_seguido_id));
      }
    } catch (error) {
      console.error('Error al obtener usuarios seguidos:', error);
    }
  };
  
  // Función para seguir/dejar de seguir a un usuario
  const handleFollowUser = async (userId) => {
    if (!currentUserId) {
      alert('Debes iniciar sesión para seguir a usuarios');
      return;
    }
    
    setFollowLoading(userId);
    
    const isFollowing = followedUsers.includes(userId);
    const action = isFollowing ? 'unfollow' : 'follow';
    
    try {
      const response = await axios.post(
        `${backendUrl}/users/UserController.php?action=${action}`,
        { userId: currentUserId, followId: userId },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        // Actualizar estado de seguidos
        if (isFollowing) {
          setFollowedUsers(followedUsers.filter(id => id !== userId));
        } else {
          setFollowedUsers([...followedUsers, userId]);
        }
      }
    } catch (error) {
      console.error(`Error al ${isFollowing ? 'dejar de seguir' : 'seguir'} al usuario:`, error);
    } finally {
      setFollowLoading(null);
    }
  };
  
  // Función para buscar usuarios
  const fetchUsers = async (page, term) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${backendUrl}/users/UserController.php?action=all&page=${page}${term ? `&search=${term}` : ''}`;
      const response = await axios.get(url, { withCredentials: true });
      
      // Intentar parsear la respuesta si viene como string JSON
      let data = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Error al parsear respuesta JSON:', e);
        }
      }
      
      // Verificamos si la respuesta tiene el formato esperado
      if (data && data.users) {
        setUsers(data.users);
        
        // Usar la información de paginación proporcionada por el backend
        if (data.pagination) {
          setUsersTotalPages(data.pagination.totalPages);
        } else {
          setUsersTotalPages(1);
        }
      } else {
        // Si el formato es distinto
        if (Array.isArray(data)) {
          setUsers(data);
          setUsersTotalPages(1); // Sin información de paginación
        } else {
          setUsers([]);
          setUsersTotalPages(1);
          console.warn('Formato de respuesta inesperado para usuarios:', data);
        }
      }
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      setError('No se pudieron cargar los usuarios. Por favor, intenta de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener sesión del usuario y sus seguidos
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        if (response.data && response.data.id) {
          setCurrentUserId(response.data.id);
          // Una vez que tenemos el ID del usuario, obtenemos sus seguidos
          fetchFollowedUsers(response.data.id);
        }
      } catch (error) {
        console.log("Error al obtener la sesión:", error);
      }
    };
    
    getSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Cargar datos iniciales según el tipo de búsqueda seleccionado
  useEffect(() => {
    if (searchType === 'projects') {
      fetchProjects(projectsCurrentPage, searchTerm);
    } else {
      fetchUsers(usersCurrentPage, searchTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Efecto para manejar cambios en los parámetros de búsqueda
  useEffect(() => {
    if (searchType === 'projects') {
      fetchProjects(projectsCurrentPage, searchTerm);
    } else {
      fetchUsers(usersCurrentPage, searchTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsCurrentPage, usersCurrentPage, searchType]);
  
  // Manejar envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'projects') {
      setProjectsCurrentPage(1); // Resetear la página a 1 cuando se realiza una nueva búsqueda
      fetchProjects(1, searchTerm);
    } else {
      setUsersCurrentPage(1);
      fetchUsers(1, searchTerm);
    }
  };
  
  // Cambiar entre búsqueda de proyectos y usuarios
  const handleTypeChange = (type) => {
    if (type !== searchType) {
      setSearchType(type);
      // No es necesario resetear la página aquí ya que el efecto se encargará de cargar los datos
    }
  };
  
  // Manejar cambio de página para proyectos
  const handleProjectsPageChange = (newPage) => {
    if (newPage < 1 || newPage > projectsTotalPages || newPage === projectsCurrentPage) return;
    setProjectsCurrentPage(newPage);
  };
  
  // Manejar cambio de página para usuarios
  const handleUsersPageChange = (newPage) => {
    if (newPage < 1 || newPage > usersTotalPages || newPage === usersCurrentPage) return;
    setUsersCurrentPage(newPage);
  };
  
  // Generar arreglo de números de página para proyectos
  const getProjectsPageNumbers = () => {
    const pageNumbers = [];
    const maxButtonsToShow = 5; // Máximo número de botones a mostrar
    
    if (projectsTotalPages <= maxButtonsToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= projectsTotalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango centrado en la página actual
      let startPage = Math.max(1, projectsCurrentPage - Math.floor(maxButtonsToShow / 2));
      let endPage = Math.min(projectsTotalPages, startPage + maxButtonsToShow - 1);
      
      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxButtonsToShow - 1) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Añadir indicadores de páginas omitidas
      if (startPage > 1) {
        pageNumbers.unshift(1);
        if (startPage > 2) pageNumbers.splice(1, 0, 'ellipsis');
      }
      
      if (endPage < projectsTotalPages) {
        if (endPage < projectsTotalPages - 1) pageNumbers.push('ellipsis');
        pageNumbers.push(projectsTotalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // Generar arreglo de números de página para usuarios
  const getUsersPageNumbers = () => {
    const pageNumbers = [];
    const maxButtonsToShow = 5; // Máximo número de botones a mostrar
    
    if (usersTotalPages <= maxButtonsToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= usersTotalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango centrado en la página actual
      let startPage = Math.max(1, usersCurrentPage - Math.floor(maxButtonsToShow / 2));
      let endPage = Math.min(usersTotalPages, startPage + maxButtonsToShow - 1);
      
      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxButtonsToShow - 1) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Añadir indicadores de páginas omitidas
      if (startPage > 1) {
        pageNumbers.unshift(1);
        if (startPage > 2) pageNumbers.splice(1, 0, 'ellipsis');
      }
      
      if (endPage < usersTotalPages) {
        if (endPage < usersTotalPages - 1) pageNumbers.push('ellipsis');
        pageNumbers.push(usersTotalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const projectsPageNumbers = getProjectsPageNumbers();
  const usersPageNumbers = getUsersPageNumbers();
  
  return (
    <div className="search-page">
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
      {/* Header Section */}
      <div className="search-header mt-20">
        <h1>Buscador <span className="accent">CompoDev</span></h1>
        <p>Encuentra componentes y desarrolladores para impulsar tus proyectos web</p>
      </div>
      
      {/* Formulario de búsqueda con estética renovada */}
      <div className="search-form-container">
      
      {/* Pestañas de navegación */}
      <div className="search-tabs">
        <button 
          className={`tab-button ${searchType === 'projects' ? 'active' : ''}`}
          onClick={() => handleTypeChange('projects')}
        >
          Proyectos
        </button>
        <button 
          className={`tab-button ${searchType === 'users' ? 'active' : ''}`}
          onClick={() => handleTypeChange('users')}
        >
          Usuarios
        </button>
      </div>
      
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder={searchType === 'projects' ? "Buscar por título o categoría..." : "Buscar por nombre o email..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button-hover">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Buscar
        </button>
      </form>
      
      {/* Estado de carga o error */}
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">{error}</div>}
      
      </div>
      
      {/* Contenido según la pestaña seleccionada */}
      {!loading && !error && searchType === 'projects' && (
        <div className="results-container">
          <h2 className="results-title">Componentes Encontrados</h2>
          {/* Tabla de proyectos */}
          <div className="table-container">
            {projects.length > 0 ? (
              <table className="cyber-table projects-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="table-row">
                      <td className="project-title">{project.titulo}</td>
                      <td className="project-category">{project.categoria}</td>
                      <td className="project-description">
                        {project.descripcion_proyecto?.length > 80
                          ? `${project.descripcion_proyecto.substring(0, 80)}...`
                          : project.descripcion_proyecto}
                      </td>
                      <td>
                        <Link to={`/code-project/${project.id}`} className="view-button">
                          Ver Proyecto
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">No se encontraron proyectos</div>
            )}
          </div>
          
          {/* Paginación para proyectos */}
          {projectsTotalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handleProjectsPageChange(projectsCurrentPage - 1)} 
                disabled={projectsCurrentPage === 1}
                className="page-button"
              >
                &laquo; Anterior
              </button>
              
              {projectsPageNumbers.map((number, index) => (
                number === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                ) : (
                  <button
                    key={number}
                    onClick={() => handleProjectsPageChange(number)}
                    className={`page-button ${projectsCurrentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                )
              ))}
              
              <button 
                onClick={() => handleProjectsPageChange(projectsCurrentPage + 1)}
                disabled={projectsCurrentPage === projectsTotalPages}
                className="page-button"
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Lista de usuarios */}
      {!loading && !error && searchType === 'users' && (
        <div className="results-container">
          <h2 className="results-title">Usuarios Encontrados</h2>
          <div className="table-container">
            {users.length > 0 ? (
              <table className="cyber-table users-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td className="user-info-cell">
                        <div className="user-avatar-name">
                          <div className="user-avatar">
                            {user.urlFoto ? (
                              <img 
                                src={`${backendUrl}/${user.urlFoto}`} 
                                alt={`${user.user}`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/50?text=No+imagen';
                                }}
                              />
                            ) : (
                              <img src="https://via.placeholder.com/50?text=No+imagen" alt="Usuario sin imagen" />
                            )}
                          </div>
                          <span className="user-name">{user.user}</span>
                        </div>
                      </td>
                      <td className="user-description-cell">
                        {user.descripcion ? (
                          user.descripcion.length > 80
                            ? `${user.descripcion.substring(0, 80)}...`
                            : user.descripcion
                        ) : (
                          <span className="no-description">Sin descripción</span>
                        )}
                      </td>
                      <td className="user-actions-cell">
                        <div className="action-buttons">
                          <Link to={`/profile/${user.id}`} className="view-button">
                            Ver Perfil
                          </Link>
                          {currentUserId && currentUserId !== user.id && (
                            <button 
                              onClick={() => handleFollowUser(user.id)}
                              className={`follow-button ${followedUsers.includes(user.id) ? 'following' : ''}`}
                              disabled={followLoading === user.id}
                            >
                              {followLoading === user.id ? (
                                <span className="loading-spinner"></span>
                              ) : followedUsers.includes(user.id) ? (
                                <>
                                  <FaUserCheck className="me-2" /> Siguiendo
                                </>
                              ) : (
                                <>
                                  <FaUserPlus className="me-2" /> Seguir
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">No se encontraron usuarios</div>
            )}
          </div>
          
          {/* Paginación para usuarios */}
          {usersTotalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handleUsersPageChange(usersCurrentPage - 1)} 
                disabled={usersCurrentPage === 1}
                className="page-button"
              >
                &laquo; Anterior
              </button>
              
              {usersPageNumbers.map((number, index) => (
                number === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                ) : (
                  <button
                    key={number}
                    onClick={() => handleUsersPageChange(number)}
                    className={`page-button ${usersCurrentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                )
              ))}
              
              <button 
                onClick={() => handleUsersPageChange(usersCurrentPage + 1)}
                disabled={usersCurrentPage === usersTotalPages}
                className="page-button"
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </div>
      )}
      
     
    </div>
  );
}
