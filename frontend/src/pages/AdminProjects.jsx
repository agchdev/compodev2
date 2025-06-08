import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTimes, 
  FaProjectDiagram,
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle 
} from 'react-icons/fa';
import '../styles/AdminComponents.css';
import '../styles/AnimatedBackground.css';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para manejo del modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({
    id: '',
    titulo: '',
    descripcion_proyecto: '',
    categoria: '',
    puntuacion: 0
  });
  
  // Estado para manejo de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Sistema de notificación personalizado
  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  // Verificar sesión de administrador
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        if (response.data && response.data.rol !== 'admin') {
          showNotification('Acceso restringido a administradores', 'error');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        navigate('/login');
      }
    };
    
    checkAdmin();
  }, [navigate, backendUrl, showNotification]);
  
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con los parámetros adecuados
      const url = `${backendUrl}/projects/ProjectController.php?action=all&page=${currentPage}&itemsPerPage=${itemsPerPage}`;
      
      // Añadir búsqueda si está presente
      const finalUrl = searchTerm ? `${url}&search=${encodeURIComponent(searchTerm)}` : url;
      
      console.log('Consultando URL:', finalUrl);
      
      const response = await axios.get(finalUrl, {
        withCredentials: true
      });

      console.log('Respuesta de proyectos:', response.data);
      
      if (response.data && response.data.projects) {
        setProjects(response.data.projects);
        
        // Actualizar la información de paginación
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
        }
      } else {
        // Si no hay datos o tienen un formato inesperado
        setProjects([]);
        setError('No se recibieron datos de proyectos en el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError(err.message || 'Error al cargar los proyectos');
      showNotification('No se pudieron cargar los proyectos', 'error');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, currentPage, itemsPerPage, searchTerm, showNotification]);

  // Cargar proyectos
  useEffect(() => {
    fetchProjects();
  }, [currentPage, fetchProjects]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Resetear a la primera página al buscar
    fetchProjects();
  };

  // Abrir modal de edición
  const handleEditClick = (project) => {
    setEditProject({ ...project });
    setShowEditModal(true);
  };

  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/projects/ProjectController.php?action=update&id=${editProject.id}`,
        editProject,
        {
          withCredentials: true
        }
      );
      
      const data = response.data;
      
      if (data.error) {
        showNotification(`Error: ${data.error}`, 'error');
      } else {
        showNotification('Proyecto actualizado correctamente', 'success');
        fetchProjects(); // Recargar proyectos
      }
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      showNotification('Error al actualizar el proyecto', 'error');
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const response = await axios.delete(
        `${backendUrl}/projects/ProjectController.php?action=delete&id=${projectToDelete}`,
        { withCredentials: true }
      );
      
      const data = response.data;
      
      if (data.error) {
        showNotification(`Error: ${data.error}`, 'error');
      } else {
        showNotification('Proyecto eliminado correctamente', 'success');
        fetchProjects(); // Recargar la lista de proyectos
      }
      
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      showNotification('Error al eliminar el proyecto', 'error');
      setShowDeleteModal(false);
    }
  };

  // Cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Renderizar paginación
  const renderPagination = () => {
    let items = [];
    
    // Número máximo de páginas para mostrar en la paginación
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar startPage si estamos cerca del final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Añadir ítem para la primera página
    items.push(
      <li key="first" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
      </li>
    );

    // Añadir ítem para la página anterior
    items.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
      </li>
    );

    // Páginas numeradas
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        </li>
      );
    }

    // Añadir ítem para la página siguiente
    items.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </li>
    );

    // Añadir ítem para la última página
    items.push(
      <li key="last" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </li>
    );

    return <ul className="cyber-pagination">{items}</ul>;
  };

  return (
    <>
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
      
      <div className="admin-container ">
        <div className="mt-20">
          <h1 className="admin-title">Administración de Proyectos</h1>
          <p className="admin-subtitle">Gestión y configuración de proyectos en la plataforma</p>
        </div>
        
        {/* Notificación */}
        {notification.show && (
          <div className={`cyber-notification ${notification.type}`}>
            {notification.type === 'success' && <FaCheckCircle />}
            {notification.type === 'error' && <FaTimes />}
            {notification.type === 'warning' && <FaExclamationTriangle />}
            {notification.type === 'info' && <FaInfoCircle />}
            <span>{notification.message}</span>
          </div>
        )}
        
        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="cyber-search-container">
            <input
              type="text"
              className="cyber-search-input"
              placeholder="Buscar por título, descripción o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="cyber-search-button">
              <FaSearch /> Buscar
            </button>
          </div>
        </form>
        
        {/* Mostrar error o contenido */}
        {loading ? (
          <div className="cyber-loading">
            <div className="cyber-spinner"></div>
            <p>Cargando proyectos...</p>
          </div>
        ) : error ? (
          <div className="cyber-error">
            <FaTimes />
            <p>{error}</p>
          </div>
        ) : (
          <>
            {projects.length === 0 ? (
              <div className="cyber-empty-state">
                <FaProjectDiagram className="icon" />
                <h3>No se encontraron proyectos</h3>
                <p>Intenta realizar una nueva búsqueda o añade nuevos proyectos</p>
              </div>
            ) : (
              <div className="cyber-table-container">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th className="id-column">ID</th>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Fecha</th>
                      <th className="actions-column">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="id-column">{project.id}</td>
                        <td>{project.titulo}</td>
                        <td>
                          <span className="cyber-badge category">
                            {project.categoria}
                          </span>
                        </td>
                        <td>{new Date(project.fecha_subido).toLocaleDateString()}</td>
                        <td className="actions-column">
                          <button
                            className="cyber-button-small edit"
                            onClick={() => handleEditClick(project)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="cyber-button-small delete"
                            onClick={() => handleDeleteClick(project.id)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="cyber-pagination-container">
                {renderPagination()}
              </div>
            )}
          </>
        )}
        
        {/* Modal de edición */}
        {showEditModal && (
          <div className="cyber-modal-backdrop">
            <div className="cyber-modal">
              <div className="cyber-modal-header">
                <h2>Editar Proyecto</h2>
                <button className="cyber-modal-close" onClick={() => setShowEditModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="cyber-modal-body">
                <div className="cyber-form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={editProject.titulo || ''}
                    onChange={(e) => setEditProject({...editProject, titulo: e.target.value})}
                    required
                  />
                </div>
                <div className="cyber-form-group">
                  <label>Descripción</label>
                  <textarea
                    className="cyber-textarea"
                    rows={5}
                    value={editProject.descripcion_proyecto || ''}
                    onChange={(e) => setEditProject({...editProject, descripcion_proyecto: e.target.value})}
                    required
                  />
                </div>
                <div className="cyber-form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={editProject.categoria || ''}
                    onChange={(e) => setEditProject({...editProject, categoria: e.target.value})}
                    required
                  />
                </div>
                <div className="cyber-form-group">
                  <label>Puntuación</label>
                  <input
                    type="number"
                    className="cyber-input"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editProject.puntuacion || 0}
                    onChange={(e) => setEditProject({...editProject, puntuacion: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="cyber-modal-footer">
                <button 
                  className="cyber-button secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="cyber-button primary" 
                  onClick={handleSaveEdit}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="cyber-modal-backdrop">
            <div className="cyber-modal">
              <div className="cyber-modal-header">
                <h2>Confirmar Eliminación</h2>
                <button className="cyber-modal-close" onClick={() => setShowDeleteModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="cyber-modal-body">
                <p>¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.</p>
              </div>
              <div className="cyber-modal-footer">
                <button 
                  className="cyber-button secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="cyber-button danger" 
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProjects;
