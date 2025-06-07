import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../assets/adminProjects.css';

const AdminMessagesUsers = () => {
  // Este componente gestiona tanto comentarios como mensajes de usuarios
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' o 'messages'
  
  // Estado para manejo del modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMessage, setEditMessage] = useState({
    id: '',
    texto: '',
    id_usuario: '',
    id_mensaje: '',
    recurso: '',
    fecha: ''
  });
  
  // Estado para manejo de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
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

  // Función para obtener comentarios
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con los parámetros adecuados
      const url = `${backendUrl}/comments_users/CommentsUserController.php?action=all&page=${currentPage}&itemsPerPage=${itemsPerPage}`;
      
      // Añadir búsqueda si está presente
      const finalUrl = searchTerm ? `${url}&search=${encodeURIComponent(searchTerm)}` : url;
      
      console.log('Consultando URL de comentarios:', finalUrl);
      
      const response = await axios.get(finalUrl, {
        withCredentials: true
      });

      console.log('Respuesta de comentarios:', response.data);
      
      if (response.data && response.data.data) {
        setComments(response.data.data);
        
        // Actualizar la información de paginación
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
        }
      } else {
        // Si no hay datos o tienen un formato inesperado
        setComments([]);
        setError('No se recibieron datos de comentarios en el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setError(err.message || 'Error al cargar los comentarios');
      showNotification('No se pudieron cargar los comentarios', 'danger');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, currentPage, itemsPerPage, searchTerm, showNotification]);

  // Función para obtener mensajes
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con los parámetros adecuados
      const url = `${backendUrl}/messages_users/MessagesUserController.php?action=all&page=${currentPage}&itemsPerPage=${itemsPerPage}`;
      
      // Añadir búsqueda si está presente
      const finalUrl = searchTerm ? `${url}&search=${encodeURIComponent(searchTerm)}` : url;
      
      console.log('Consultando URL de mensajes:', finalUrl);
      
      const response = await axios.get(finalUrl, {
        withCredentials: true
      });

      console.log('Respuesta de mensajes:', response.data);
      
      if (response.data && response.data.data) {
        setMessages(response.data.data);
        
        // Actualizar la información de paginación
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
        }
      } else {
        // Si no hay datos o tienen un formato inesperado
        setMessages([]);
        setError('No se recibieron datos de mensajes en el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError(err.message || 'Error al cargar los mensajes');
      showNotification('No se pudieron cargar los mensajes', 'danger');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, currentPage, itemsPerPage, searchTerm, showNotification]);
  
  // Cargar datos según la pestaña activa
  useEffect(() => {
    if (activeTab === 'comments') {
      fetchComments();
    } else {
      fetchMessages();
    }
  }, [activeTab, fetchComments, fetchMessages]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Resetear a la primera página al buscar
    fetchMessages();
  };

  // Abrir modal de edición
  const handleEditClick = (message) => {
    setEditMessage({ ...message });
    setShowEditModal(true);
  };

  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    const endpointBase = activeTab === 'comments' ? 'comments_users/CommentsUserController.php' : 'messages_users/MessagesUserController.php';
    try {
      const response = await fetch(`${backendUrl}/${endpointBase}?action=update&id=${editMessage.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editMessage),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setNotification({ show: true, message: `Error: ${data.error}`, type: 'danger' });
      } else {
        setNotification({ show: true, message: 'Mensaje actualizado correctamente', type: 'success' });
        fetchMessages(); // Recargar mensajes
      }
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      setNotification({ show: true, message: 'Error al actualizar el mensaje', type: 'danger' });
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleConfirmDelete = async () => {
    const endpointBase = activeTab === 'comments' ? 'comments_users/CommentsUserController.php' : 'messages_users/MessagesUserController.php';
    if (!messageToDelete) return;
    
    try {
      const response = await fetch(`${backendUrl}/${endpointBase}?action=delete&id=${messageToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.error) {
        showNotification(`Error: ${data.error}`, 'danger');
      } else {
        showNotification('Mensaje eliminado correctamente', 'success');
        fetchMessages(); // Recargar la lista de mensajes
      }
      
      setShowDeleteModal(false);
      setMessageToDelete(null);
    } catch (err) {
      console.error('Error al eliminar mensaje:', err);
      showNotification('Error al eliminar el mensaje', 'danger');
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
      <h2 className="mb-4">Administración de Usuarios - Comunicaciones</h2>
      
      {/* Pestañas para alternar entre comentarios y mensajes */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('comments')}
          >
            Comentarios
          </button>
          <button 
            type="button" 
            className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('messages')}
          >
            Mensajes
          </button>
        </div>
      </div>
      
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
            placeholder="Buscar mensajes..."
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
          {messages.length === 0 ? (
            <Alert variant="info">No se encontraron mensajes</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-3 admin-table">
                <thead className="bg-primary text-white">
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th style={{ width: '30%' }}>Texto</th>
                    <th style={{ width: '20%' }}>Usuario</th>
                    {activeTab === 'comments' && <th style={{ width: '80px' }}>ID Mensaje</th>}
                    <th>Recurso</th>
                    <th style={{ width: '160px' }}>Fecha</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2 mb-0">Cargando datos...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="text-danger text-center py-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                      </td>
                    </tr>
                  ) : activeTab === 'comments' ? (
                    comments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-3">
                          <i className="bi bi-chat-left-text me-2"></i>
                          No hay comentarios para mostrar.
                        </td>
                      </tr>
                    ) : (
                      comments.map((comment) => (
                        <tr key={comment.id}>
                          <td className="text-center">{comment.id}</td>
                          <td className="text-wrap">
                            <div style={{ maxHeight: '80px', overflow: 'auto' }} className="text-break">
                              {comment.texto}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center user-info">
                              {comment.avatar ? (
                                <img
                                  src={`${backendUrl}/uploads/${comment.avatar}`}
                                  alt="Avatar"
                                  className="me-2 rounded-circle border"
                                  width="40"
                                  height="40"
                                />
                              ) : (
                                <div className="me-2 user-avatar-placeholder rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span>{comment.username ? comment.username.charAt(0).toUpperCase() : '?'}</span>
                                </div>
                              )}
                              <div>
                                <div className="fw-bold">{comment.username || 'Usuario ' + comment.id_usuario}</div>
                                {comment.email && <div className="text-muted small text-truncate" style={{ maxWidth: '150px' }}>{comment.email}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{comment.id_mensaje || '-'}</td>
                          <td>{comment.recurso || '-'}</td>
                          <td className="text-nowrap">
                            <div>{new Date(comment.fecha).toLocaleDateString()}</div>
                            <small className="text-muted">{new Date(comment.fecha).toLocaleTimeString()}</small>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1 d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleEditClick(comment)}
                                title="Editar"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleDeleteClick(comment.id)}
                                title="Eliminar"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    messages.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-3">
                          <i className="bi bi-envelope me-2"></i>
                          No hay mensajes para mostrar.
                        </td>
                      </tr>
                    ) : (
                      messages.map((message) => (
                        <tr key={message.id}>
                          <td className="text-center">{message.id}</td>
                          <td className="text-wrap">
                            <div style={{ maxHeight: '80px', overflow: 'auto' }} className="text-break">
                              {message.texto}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center user-info">
                              {message.avatar ? (
                                <img
                                  src={message.avatar}
                                  alt="Avatar"
                                  className="me-2 rounded-circle border"
                                  width="40"
                                  height="40"
                                />
                              ) : (
                                <div className="me-2 user-avatar-placeholder rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span>{message.username ? message.username.charAt(0).toUpperCase() : '?'}</span>
                                </div>
                              )}
                              <div>
                                <div className="fw-bold">{message.username || 'Usuario ' + message.id_usuario}</div>
                                {message.email && <div className="text-muted small text-truncate" style={{ maxWidth: '150px' }}>{message.email}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{message.id_mensaje || '-'}</td>
                          <td>{message.recurso || '-'}</td>
                          <td className="text-nowrap">
                            <div>{new Date(message.fecha).toLocaleDateString()}</div>
                            <small className="text-muted">{new Date(message.fecha).toLocaleTimeString()}</small>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1 d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleEditClick(message)}
                                title="Editar"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleDeleteClick(message.id)}
                                title="Eliminar"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  )}
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
          <Modal.Title>Editar {activeTab === 'comments' ? 'Comentario' : 'Mensaje'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Texto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editMessage.texto || ''}
                onChange={(e) => setEditMessage({...editMessage, texto: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Usuario</Form.Label>
              <Form.Control
                type="number"
                value={editMessage.id_usuario || ''}
                onChange={(e) => setEditMessage({...editMessage, id_usuario: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Mensaje</Form.Label>
              <Form.Control
                type="number"
                value={editMessage.id_mensaje || ''}
                onChange={(e) => setEditMessage({...editMessage, id_mensaje: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recurso</Form.Label>
              <Form.Control
                type="text"
                value={editMessage.recurso || ''}
                onChange={(e) => setEditMessage({...editMessage, recurso: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editMessage.fecha ? new Date(editMessage.fecha).toISOString().slice(0, 16) : ''}
                onChange={(e) => setEditMessage({...editMessage, fecha: e.target.value})}
                required
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
          ¿Estás seguro de que deseas eliminar este {activeTab === 'comments' ? 'comentario' : 'mensaje'}? Esta acción no se puede deshacer.
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

export default AdminMessagesUsers;
