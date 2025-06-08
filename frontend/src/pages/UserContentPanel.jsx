import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Tab, Tabs, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { FaTrash, FaSearch, FaUser, FaClock, FaLink, FaComment, FaEnvelope, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './UserContentPanel.css';
import '../styles/AnimatedBackground.css';

const API_BASE_URL = 'http://localhost/compodev2/backend';

const UserContentPanel = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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

  // Estado para ordenamiento de tablas
  const [messagesSort, setMessagesSort] = useState({ field: null, direction: 'asc' });
  const [commentsSort, setCommentsSort] = useState({ field: null, direction: 'asc' });

  // Ordenar mensajes
  const handleMessageSort = (field) => {
    const newDirection =
      messagesSort.field === field && messagesSort.direction === 'asc' ? 'desc' : 'asc';

    setMessagesSort({ field, direction: newDirection });

    // Ordenar los mensajes localmente
    const sortedMessages = [...messages].sort((a, b) => {
      if (field === 'fecha') {
        return newDirection === 'asc'
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      } else {
        if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });

    setMessages(sortedMessages);
  };

  // Ordenar comentarios
  const handleCommentSort = (field) => {
    const newDirection =
      commentsSort.field === field && commentsSort.direction === 'asc' ? 'desc' : 'asc';

    setCommentsSort({ field, direction: newDirection });

    // Ordenar los comentarios localmente
    const sortedComments = [...comments].sort((a, b) => {
      if (field === 'fecha') {
        return newDirection === 'asc'
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      } else {
        if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });

    setComments(sortedComments);
  };

  // Renderizar iconos de ordenamiento
  const renderSortIcon = (field, currentSort) => {
    if (currentSort.field !== field) return null;
    return currentSort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Renderizar tabla de mensajes
  const renderMessagesTable = () => {
    if (messagesLoading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }

    if (messagesError) {
      return <Alert variant="danger">{messagesError}</Alert>;
    }

    if (messages.length === 0) {
      return <Alert variant="info">No se encontraron mensajes.</Alert>;
    }

    return (
      <div className="table-responsive message-table-container mx-10">
        <Table striped hover className="message-table">
          <thead>
            <tr className="admin-table-header">
              <th onClick={() => handleMessageSort('username')} className="sortable">
                <FaUser className="me-1" /> Usuario {renderSortIcon('username', messagesSort)}
              </th>
              <th onClick={() => handleMessageSort('texto')} className="sortable d-none d-md-table-cell">
                Mensaje {renderSortIcon('texto', messagesSort)}
              </th>
              <th onClick={() => handleMessageSort('fecha')} className="sortable d-none d-md-table-cell">
                <FaClock className="me-1" /> Fecha {renderSortIcon('fecha', messagesSort)}
              </th>
              <th className="action-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => (
              <tr key={message.id} className="message-row h-full">
                <td className='flex items-center'>
                  <div className="flex items-center">
                    <div className='rounded-full overflow-hidden w-[32px] h-[32px] me-2 border border-gray-300'>
                      <img
                        src={`${backendUrl}/${message.avatar || 'https://via.placeholder.com/32'}`}
                        alt={message.user || 'Usuario'}
                        width="32"
                        height="32"
                      />
                    </div>

                    <div className='flex items-center gap-10'>
                      <strong>{message.username || 'Usuario desconocido'}</strong>
                      <div className="text-muted small">
                        <FaEnvelope className="me-1" /> {message.email || 'Sin email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="d-none d-md-table-cell mensaje-texto">
                  {message.texto}
                  {message.recurso && (
                    <div className="resource-link small">
                      <FaLink className="me-1" />
                      <a href={message.recurso} target="_blank" rel="noopener noreferrer">
                        {message.recurso}
                      </a>
                    </div>
                  )}
                </td>
                <td className="text-nowrap d-none d-md-table-cell">
                  {new Date(message.fecha).toLocaleString()}
                </td>
                <td>
                  <div className="flex items-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(message.id, 'message')}
                      aria-label="Eliminar mensaje"
                      className="m-1"
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="d-md-none m-1"
                      aria-label="Ver detalles"
                      onClick={() => alert(`Mensaje: ${message.texto}\nFecha: ${new Date(message.fecha).toLocaleString()}`)}
                    >
                      Ver
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Renderizar tabla de comentarios
  const renderCommentsTable = () => {
    if (commentsLoading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }

    if (commentsError) {
      return <Alert variant="danger">{commentsError}</Alert>;
    }

    if (comments.length === 0) {
      return <Alert variant="info">No se encontraron comentarios.</Alert>;
    }

    return (
      <div className="table-responsive comment-table-container  mx-10">
        <Table striped hover className="comment-table">
          <thead>
            <tr className="admin-table-header">
              <th onClick={() => handleCommentSort('username')} className="sortable">
                <FaUser className="me-1" /> Usuario {renderSortIcon('username', commentsSort)}
              </th>
              <th onClick={() => handleCommentSort('texto')} className="sortable d-none d-md-table-cell">
                <FaComment className="me-1" /> Comentario {renderSortIcon('texto', commentsSort)}
              </th>
              <th onClick={() => handleCommentSort('fecha')} className="sortable d-none d-md-table-cell">
                <FaClock className="me-1" /> Fecha {renderSortIcon('fecha', commentsSort)}
              </th>
              <th className="action-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id} className="comment-row">
                <td>
                  <div className="flex align-items-center">
                    <div className='rounded-full overflow-hidden w-[32px] h-[32px] me-2 border border-gray-300'>
                      <img
                        src={`${backendUrl}/${comment.avatar || 'https://via.placeholder.com/32'}`}
                        alt={comment.username || 'Usuario'}
                        width="32"
                        height="32"
                      />
                    </div>
                    <div className="flex gap-10">
                      <strong>{comment.username || 'Usuario desconocido'}</strong>
                      <div className="text-muted small">
                        <FaEnvelope className="me-1" /> {comment.email || 'Sin email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="none d-md-table-cell comentario-texto">
                  {comment.texto}
                  {comment.recurso && (
                    <div className="resource-link small">
                      <FaLink className="me-1" />
                      <a href={comment.recurso} target="_blank" rel="noopener noreferrer">
                        {comment.recurso}
                      </a>
                    </div>
                  )}
                </td>
                <td className="text-nowrap d-none d-md-table-cell">
                  {new Date(comment.fecha).toLocaleString()}
                </td>
                <td>
                  <div className="flex">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(comment.id, 'comment')}
                      aria-label="Eliminar comentario"
                      className="m-1"
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="d-md-none m-1"
                      aria-label="Ver detalles"
                      onClick={() => alert(`Comentario: ${comment.texto}\nFecha: ${new Date(comment.fecha).toLocaleString()}`)}
                    >
                      Ver
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Renderizar paginación con estilo cyberpunk
  const renderPagination = (currentPage, totalPages, handlePageChange) => {
    if (totalPages <= 1) return null;

    // Cálculo de rango visible de páginas
    let startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 1);

    const items = [];

    // Botón para primera página
    items.push(
      <li key="first">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'active' : ''}
          title="Primera página"
        >
          &laquo;
        </button>
      </li>
    );

    // Botón para página anterior
    items.push(
      <li key="prev">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          <FaChevronLeft />
        </button>
      </li>
    );

    // Páginas numeradas
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <li key={page}>
          <button
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
            title={`Página ${page}`}
          >
            {page}
          </button>
        </li>
      );
    }

    // Botón para página siguiente
    items.push(
      <li key="next">
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página siguiente"
        >
          <FaChevronRight />
        </button>
      </li>
    );

    // Botón para última página
    items.push(
      <li key="last">
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Última página"
        >
          &raquo;
        </button>
      </li>
    );

    return (
      <div className="cyber-pagination-container">
        <ul className="cyber-pagination">{items}</ul>
      </div>
    );
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

      <Container fluid className="user-content-panel">

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
                <Form onSubmit={handleMessagesSearch} className="mb-4 w-90 m-auto">
                  <InputGroup className=" flex items-center gap-5 justify-center">
                    <Form.Control
                      type="text"
                      placeholder="Buscar en mensajes..."
                      value={messagesSearch}
                      onChange={(e) => setMessagesSearch(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>

                {/* Contenido de mensajes */}
                <div className="messages-container">
                  {renderMessagesTable()}
                  {!messagesLoading && !messagesError && messages.length > 0 &&
                    renderPagination(messagesCurrentPage, messagesTotalPages, handleMessagesPageChange)
                  }
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
                <Form onSubmit={handleCommentsSearch} className="mb-4 w-90 m-auto">
                  <InputGroup className="flex items-center gap-5 justify-center">
                    <Form.Control
                      type="text"
                      placeholder="Buscar en comentarios..."
                      value={commentsSearch}
                      onChange={(e) => setCommentsSearch(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>

                {/* Contenido de comentarios */}
                <div className="comments-container">
                  {renderCommentsTable()}
                  {!commentsLoading && !commentsError && comments.length > 0 &&
                    renderPagination(commentsCurrentPage, commentsTotalPages, handleCommentsPageChange)
                  }
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Modal de confirmación de eliminación estilo cyber */}
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
                <p>¿Está seguro que desea eliminar este {itemToDelete.type === 'message' ? 'mensaje' : 'comentario'}? Esta acción no se puede deshacer.</p>
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
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Los estilos están definidos en CSS global */}
      </Container>
    </>
  );
};

export default UserContentPanel;
