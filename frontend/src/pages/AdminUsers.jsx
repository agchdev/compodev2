import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../assets/adminProjects.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para manejo del modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    rol: ''
  });
  
  // Estado para manejo de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  // Sistema de notificación personalizado
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con los parámetros adecuados
      const url = `${backendUrl}/users/UserController.php?action=all&page=${currentPage}&itemsPerPage=${itemsPerPage}`;
      
      // Añadir búsqueda si está presente
      const finalUrl = searchTerm ? `${url}&search=${encodeURIComponent(searchTerm)}` : url;
      
      console.log('Consultando URL:', finalUrl);
      
      const response = await axios.get(finalUrl, {
        withCredentials: true
      });

      console.log('Respuesta de usuarios:', response.data);
      
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        
        // Actualizar la información de paginación
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
        }
      } else {
        // Si no hay datos o tienen un formato inesperado
        setUsers([]);
        setError('No se recibieron datos de usuarios en el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar los usuarios');
      showNotification('No se pudieron cargar los usuarios', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Resetear a la primera página al buscar
    fetchUsers();
  };

  // Abrir modal de edición
  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${backendUrl}/users/UserController.php?action=update&id=${editUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUser),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setNotification({ show: true, message: `Error: ${data.error}`, type: 'danger' });
      } else {
        setNotification({ show: true, message: 'Usuario actualizado correctamente', type: 'success' });
        fetchUsers(); // Recargar usuarios
      }
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      setNotification({ show: true, message: 'Error al actualizar el usuario', type: 'danger' });
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`${backendUrl}/users/UserController.php?action=delete&id=${userToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.error) {
        showNotification(`Error: ${data.error}`, 'danger');
      } else {
        showNotification('Usuario eliminado correctamente', 'success');
        fetchUsers(); // Recargar la lista de usuarios
      }
      
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      showNotification('Error al eliminar el usuario', 'danger');
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

    // Primera página
    items.push(
      <Pagination.First 
        key="first" 
        onClick={() => handlePageChange(1)} 
        disabled={currentPage === 1}
      />
    );

    // Página anterior
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
      />
    );

    // Páginas numeradas
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Página siguiente
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
      />
    );

    // Última página
    items.push(
      <Pagination.Last 
        key="last" 
        onClick={() => handlePageChange(totalPages)} 
        disabled={currentPage === totalPages}
      />
    );

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

  return (
    <div className="admin-container container-fluid py-4">
      <h2 className="mb-4">Administración de Usuarios</h2>
      
      {/* Notificación */}
      {notification.show && (
        <Alert 
          variant={notification.type} 
          className="notification-alert"
          onClose={() => setNotification({...notification, show: false})} 
          dismissible
        >
          {notification.message}
        </Alert>
      )}
      
      {/* Formulario de búsqueda */}
      <Form onSubmit={handleSearch} className="mb-4 search-form">
        <div className="input-group">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" type="submit" title="Buscar">
            <FaSearch />
          </Button>
        </div>
      </Form>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <Alert variant="info">No se encontraron usuarios</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha de registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.apellidos}</td>
                      <td>{user.email}</td>
                      <td>{user.rol}</td>
                      <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditClick(user)}
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
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
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editUser.nombre || ''}
                onChange={(e) => setEditUser({...editUser, nombre: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                value={editUser.apellidos || ''}
                onChange={(e) => setEditUser({...editUser, apellidos: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser.email || ''}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={editUser.rol || ''}
                onChange={(e) => setEditUser({...editUser, rol: e.target.value})}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
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
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
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

export default AdminUsers;
