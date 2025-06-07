import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../assets/adminProjects.css';

const AdminProjects = () => {
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

  // Cargar proyectos
  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm]);

  // Sistema de notificación personalizado
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchProjects = async () => {
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
      showNotification('No se pudieron cargar los proyectos', 'danger');
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch(`${backendUrl}/projects/ProjectController.php?action=update&id=${editProject.id}`, {
        method: 'POST', // Usar POST para mayor compatibilidad
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProject),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setNotification({ show: true, message: `Error: ${data.error}`, type: 'danger' });
      } else {
        setNotification({ show: true, message: 'Proyecto actualizado correctamente', type: 'success' });
        fetchProjects(); // Recargar proyectos
      }
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al actualizar proyecto:', err);
      setNotification({ show: true, message: 'Error al actualizar el proyecto', type: 'danger' });
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}/projects/ProjectController.php?action=delete&id=${projectToDelete}`, {
        method: 'POST', // Usar POST para mayor compatibilidad
      });
      
      const data = await response.json();
      
      if (data.error) {
        setNotification({ show: true, message: `Error: ${data.error}`, type: 'danger' });
      } else {
        setNotification({ show: true, message: 'Proyecto eliminado correctamente', type: 'success' });
        fetchProjects(); // Recargar proyectos
      }
      
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      setNotification({ show: true, message: 'Error al eliminar el proyecto', type: 'danger' });
    }
  };

  // Cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Renderizar paginación
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  if (loading && projects.length === 0) {
    return <div className="text-center my-5">Cargando proyectos...</div>;
  }

  return (
    <div className="admin-projects-container">
      <h1 className="mb-4">Administración de Proyectos</h1>
      
      {/* Notificación */}
      {notification.show && (
        <Alert variant={notification.type} onClose={() => setNotification({...notification, show: false})} dismissible>
          {notification.message}
        </Alert>
      )}
      
      {/* Barra de búsqueda */}
      <Form onSubmit={handleSearch} className="search-form mb-4">
        <div className="d-flex">
          <Form.Control
            type="text"
            placeholder="Buscar proyectos por título, descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
          />
          <Button type="submit" variant="primary">
            <FaSearch /> Buscar
          </Button>
        </div>
      </Form>
      
      {/* Tabla de proyectos */}
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {projects.length === 0 ? (
            <Alert variant="info">No se encontraron proyectos.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="project-table">
                <thead>
                  <tr>
                    <th className="id-column">ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Puntuación</th>
                    <th className="actions-column">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.id}</td>
                      <td>{project.titulo}</td>
                      <td className="description-column">
                        {project.descripcion_proyecto.length > 100
                          ? `${project.descripcion_proyecto.substring(0, 100)}...`
                          : project.descripcion_proyecto}
                      </td>
                      <td>{project.categoria}</td>
                      <td>{project.nombre_usuario || 'Desconocido'}</td>
                      <td>{new Date(project.fecha_subido).toLocaleDateString()}</td>
                      <td>{project.puntuacion}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditClick(project)}
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(project.id)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {/* Paginación */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
      
      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={editProject.titulo || ''}
                onChange={(e) => setEditProject({...editProject, titulo: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={editProject.descripcion_proyecto || ''}
                onChange={(e) => setEditProject({...editProject, descripcion_proyecto: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={editProject.categoria || ''}
                onChange={(e) => setEditProject({...editProject, categoria: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Puntuación</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editProject.puntuacion || 0}
                onChange={(e) => setEditProject({...editProject, puntuacion: parseFloat(e.target.value)})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProjects;
