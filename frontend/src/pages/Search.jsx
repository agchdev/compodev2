import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Search.css';

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
    <div className="search-container">
      <h2>Búsqueda</h2>
      
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
        <button type="submit" className="search-button">Buscar</button>
      </form>
      
      {/* Estado de carga o error */}
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">{error}</div>}
      
      {/* Contenido según la pestaña seleccionada */}
      {!loading && !error && searchType === 'projects' && (
        <>
          {/* Lista de proyectos */}
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
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
              ))
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
        </>
      )}
      
      {/* Lista de usuarios */}
      {!loading && !error && searchType === 'users' && (
        <>
          <div className="users-list">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-image">
                    {user.imagen ? (
                      <img 
                        src={`${backendUrl}/users/imagenes/${user.imagen}`} 
                        alt={`${user.username}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+imagen';
                        }}
                      />
                    ) : (
                      <img src="https://via.placeholder.com/150?text=No+imagen" alt="Usuario sin imagen" />
                    )}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.username}</h3>
                    <p className="user-email">{user.email}</p>
                    {user.descripcion && (
                      <p className="user-description">
                        {user.descripcion.length > 100 
                          ? `${user.descripcion.substring(0, 100)}...` 
                          : user.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="user-actions">
                    <Link to={`/profile/${user.id}`} className="view-button">
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              ))
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
        </>
      )}
    </div>
  );
}
