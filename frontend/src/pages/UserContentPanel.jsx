import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Tab, Tabs, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { FaTrash, FaSearch, FaUser, FaClock, FaLink, FaComment, FaEnvelope } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';
import './UserContentPanel.css';

const API_BASE_URL = 'http://localhost/compodev2/backend';

const UserContentPanel = () => {
  // Estado para mensajes
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(null);
  const [messagesCurrentPage, setMessagesCurrentPage] = useState(1);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);
  const [messagesSearch, setMessagesSearch] = useState('');

  // Estado para comentarios
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsSearch, setCommentsSearch] = useState('');

  // Estado para modales de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });

  // Cargar mensajes
  const fetchMessages = async (page = 1, search = '') => {
    setMessagesLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages_users/MessagesUserController.php?action=all&page=${page}&search=${search}&itemsPerPage=10`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(data.data);
      setMessagesCurrentPage(data.pagination.currentPage);
      setMessagesTotalPages(data.pagination.totalPages);
      setMessagesError(null);
    } catch (error) {
      setMessagesError(`Error al cargar mensajes: ${error.message}`);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Cargar comentarios
  const fetchComments = async (page = 1, search = '') => {
    setCommentsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/comments_users/CommentsUserController.php?action=all&page=${page}&search=${search}&itemsPerPage=10`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setComments(data.data);
      setCommentsCurrentPage(data.pagination.currentPage);
      setCommentsTotalPages(data.pagination.totalPages);
      setCommentsError(null);
    } catch (error) {
      setCommentsError(`Error al cargar comentarios: ${error.message}`);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Eliminar mensaje o comentario
  const handleDelete = async () => {
    const { id, type } = itemToDelete;
    
    if (!id || !type) return;
    
    try {
      const endpoint = type === 'message' 
        ? `${API_BASE_URL}/messages_users/MessagesUserController.php?action=delete&id=${id}`
        : `${API_BASE_URL}/comments_users/CommentsUserController.php?action=delete&id=${id}`;
        
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Recargar datos después de eliminar
      if (type === 'message') {
        fetchMessages(messagesCurrentPage, messagesSearch);
      } else {
        fetchComments(commentsCurrentPage, commentsSearch);
      }
      
      // Cerrar modal
      setShowDeleteModal(false);
    } catch (error) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  // Confirmar eliminación
  const confirmDelete = (id, type) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  // Ejecutar búsqueda de mensajes
  const handleMessagesSearch = (e) => {
    e.preventDefault();
    setMessagesCurrentPage(1);
    fetchMessages(1, messagesSearch);
  };

  // Ejecutar búsqueda de comentarios
  const handleCommentsSearch = (e) => {
    e.preventDefault();
    setCommentsCurrentPage(1);
    fetchComments(1, commentsSearch);
  };

  // Navegar por páginas de mensajes
  const handleMessagesPageChange = (newPage) => {
    if (newPage > 0 && newPage <= messagesTotalPages) {
      setMessagesCurrentPage(newPage);
      fetchMessages(newPage, messagesSearch);
    }
  };

  // Navegar por páginas de comentarios
  const handleCommentsPageChange = (newPage) => {
    if (newPage > 0 && newPage <= commentsTotalPages) {
      setCommentsCurrentPage(newPage);
      fetchComments(newPage, commentsSearch);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchMessages();
    fetchComments();
  }, []);

  // Renderizar mensaje individual
  const renderMessage = (message) => (
    <Card className="mb-3 message-card" key={message.id}>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img 
            src={message.avatar || 'https://via.placeholder.com/40'} 
            alt={message.username || 'Usuario'} 
            className="rounded-circle me-2" 
            width="40" 
            height="40"
          />
          <div>
            <strong><FaUser className="me-1" /> {message.username || 'Usuario desconocido'}</strong>
            <div className="text-muted small">
              <FaEnvelope className="me-1" /> {message.email || 'Sin email'}
            </div>
          </div>
        </div>
        <div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => confirmDelete(message.id, 'message')}
            aria-label="Eliminar mensaje"
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>{message.texto}</Card.Text>
        {message.recurso && (
          <div className="resource-link">
            <FaLink className="me-1" />
            <a href={message.recurso} target="_blank" rel="noopener noreferrer">
              {message.recurso}
            </a>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted d-flex justify-content-between">
        <span><FaClock className="me-1" /> {new Date(message.fecha).toLocaleString()}</span>
        <span>ID: {message.id}</span>
      </Card.Footer>
    </Card>
  );

  // Renderizar comentario individual
  const renderComment = (comment) => (
    <Card className="mb-3 comment-card" key={comment.id}>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img 
            src={comment.avatar || 'https://via.placeholder.com/40'} 
            alt={comment.username || 'Usuario'} 
            className="rounded-circle me-2" 
            width="40" 
            height="40"
          />
          <div>
            <strong><FaUser className="me-1" /> {comment.username || 'Usuario desconocido'}</strong>
            <div className="text-muted small">
              <FaEnvelope className="me-1" /> {comment.email || 'Sin email'}
            </div>
          </div>
        </div>
        <div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => confirmDelete(comment.id, 'comment')}
            aria-label="Eliminar comentario"
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <FaComment className="me-2" /> {comment.texto}
        </Card.Text>
        {comment.recurso && (
          <div className="resource-link">
            <FaLink className="me-1" />
            <a href={comment.recurso} target="_blank" rel="noopener noreferrer">
              {comment.recurso}
            </a>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted d-flex justify-content-between">
        <span><FaClock className="me-1" /> {new Date(comment.fecha).toLocaleString()}</span>
        <span>ID: {comment.id}</span>
      </Card.Footer>
    </Card>
  );

  // Renderizar paginación
  const renderPagination = (currentPage, totalPages, handlePageChange) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="d-flex justify-content-center mt-4 mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-2"
        >
          Anterior
        </Button>
        
        <div className="d-flex mx-2 align-items-center">
          Página {currentPage} de {totalPages}
        </div>
        
        <Button 
          variant="outline-secondary" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          Siguiente
        </Button>
      </div>
    );
  };

  return (
    <Container fluid>
      <AdminHeader title="Contenido de Usuarios" />
      
      <Row className="mt-4">
        <Col>
          <Tabs defaultActiveKey="messages" id="content-tabs" className="mb-3">
            {/* Tab de Mensajes */}
            <Tab eventKey="messages" title={
              <div>
                Mensajes
                {messages.length > 0 && (
                  <Badge bg="primary" className="ms-2">{messages.length}</Badge>
                )}
              </div>
            }>
              {/* Barra de búsqueda para mensajes */}
              <Form onSubmit={handleMessagesSearch} className="mb-4">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar en mensajes..."
                    value={messagesSearch}
                    onChange={(e) => setMessagesSearch(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch /> Buscar
                  </Button>
                </InputGroup>
              </Form>

              {/* Contenido de mensajes */}
              <div className="messages-container">
                {messagesLoading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  </div>
                ) : messagesError ? (
                  <Alert variant="danger">{messagesError}</Alert>
                ) : messages.length === 0 ? (
                  <Alert variant="info">No se encontraron mensajes.</Alert>
                ) : (
                  <>
                    {messages.map(renderMessage)}
                    {renderPagination(messagesCurrentPage, messagesTotalPages, handleMessagesPageChange)}
                  </>
                )}
              </div>
            </Tab>
            
            {/* Tab de Comentarios */}
            <Tab eventKey="comments" title={
              <div>
                Comentarios
                {comments.length > 0 && (
                  <Badge bg="primary" className="ms-2">{comments.length}</Badge>
                )}
              </div>
            }>
              {/* Barra de búsqueda para comentarios */}
              <Form onSubmit={handleCommentsSearch} className="mb-4">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar en comentarios..."
                    value={commentsSearch}
                    onChange={(e) => setCommentsSearch(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch /> Buscar
                  </Button>
                </InputGroup>
              </Form>

              {/* Contenido de comentarios */}
              <div className="comments-container">
                {commentsLoading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  </div>
                ) : commentsError ? (
                  <Alert variant="danger">{commentsError}</Alert>
                ) : comments.length === 0 ? (
                  <Alert variant="info">No se encontraron comentarios.</Alert>
                ) : (
                  <>
                    {comments.map(renderComment)}
                    {renderPagination(commentsCurrentPage, commentsTotalPages, handleCommentsPageChange)}
                  </>
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este {itemToDelete.type === 'message' ? 'mensaje' : 'comentario'}?
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Los estilos están definidos en CSS global */}
    </Container>
  );
};

export default UserContentPanel;
