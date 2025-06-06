import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Estilos CSS en línea
const styles = {
  container: {
    padding: '16px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  messageCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
  },
  commentSection: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginTop: '8px'
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px',
    fontWeight: 'bold'
  },
  smallAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '8px',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  },
  textField: {
    width: '100%',
    padding: '8px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '8px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    color: '#1976d2'
  },
  divider: {
    borderTop: '1px solid #e0e0e0',
    margin: '16px 0'
  },
  userName: {
    fontWeight: 'bold',
    margin: '0 0 4px 0'
  },
  date: {
    color: '#666',
    fontSize: '12px',
    margin: '2px 0'
  },
  notification: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '4px',
    color: 'white',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  formContainer: {
    marginBottom: '32px'
  }
};

const Foro = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newComment, setNewComment] = useState('');
    const [notification, setNotification] = useState({show: false, message: '', type: ''});

    // Obtener la sesión del usuario
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/users/UserController.php?action=session`,
                    { withCredentials: true }
                );
                const userData = response.data;
                setUser(userData);
                
                // Una vez que tenemos el usuario, cargamos los mensajes
                fetchMessages();
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
                navigate('/login');
            }
        };
        
        getSession();
    }, [navigate]);

    // Sistema de notificación personalizado
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Obtener los últimos 10 mensajes
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}messages_users/MessagesUserController.php?action=all&itemsPerPage=10`,
                { withCredentials: true }
            );
            console.log('Respuesta de mensajes:', response.data);
            // Asegurarse de que response.data.data existe y es un array
            setMessages(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
            showNotification("Error al cargar los mensajes", "error");
        } finally {
            setLoading(false);
        }
    };

    // Obtener comentarios de un mensaje
    const fetchComments = async (messageId) => {
        try {
            setLoadingComments(true);
            const response = await axios.get(
                `${backendUrl}comments_users/CommentsUserController.php?action=byMessage&id_mensaje=${messageId}`,
                { withCredentials: true }
            );
            console.log('Respuesta de comentarios:', response.data);
            // Verificar y garantizar que siempre tengamos un array
            console.log(response)
            const commentsData = response.data && response.data.data;
            setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (error) {
            console.error("Error al obtener los comentarios:", error);
            showNotification("Error al cargar los comentarios", "error");
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    // Manejar clic en un mensaje para ver comentarios
    const handleMessageClick = (message) => {
        if (selectedMessage && selectedMessage.id === message.id) {
            // Si ya está seleccionado, lo deseleccionamos
            setSelectedMessage(null);
            setComments([]);
        } else {
            // Seleccionamos el mensaje y cargamos sus comentarios
            setSelectedMessage(message);
            fetchComments(message.id);
        }
    };

    // Publicar un nuevo mensaje
    const handlePostMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) {
            showNotification("El mensaje no puede estar vacío", "warning");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}messages_users/MessagesUserController.php?action=create`,
                {
                    texto: newMessage.trim(),
                    id_usuario: user.id,
                    recurso: '' // Campo obligatorio según el backend
                },
                { withCredentials: true }
            );
            console.log(response)
            showNotification("Mensaje publicado con éxito", "success");
            setNewMessage('');
            fetchMessages(); // Recargar la lista de mensajes
        } catch (error) {
            console.error("Error al publicar el mensaje:", error);
            showNotification("Error al publicar el mensaje", "error");
        }
    };

    // Publicar un nuevo comentario
    const handlePostComment = async (e) => {
        // Prevenir que se recargue la página al enviar el formulario
        e.preventDefault();
        if (!newComment.trim()) {
            showNotification("El comentario no puede estar vacío", "error");
            return;
        }
        
        if (!selectedMessage || !selectedMessage.id) {
            showNotification("Error: No hay mensaje seleccionado", "error");
            return;
        }

        try {
            // El campo id_comentario en realidad almacena el ID del mensaje relacionado
            // Asegurar que los IDs sean enteros para evitar problemas de tipo
            const postData = {
                texto: newComment.trim(),
                id_usuario: parseInt(user.id, 10),
                id_mensaje: parseInt(selectedMessage.id, 10),
                fecha: new Date().toISOString().slice(0, 19).replace('T', ' '), // formato MySQL datetime
                recurso: '' // Campo obligatorio según el backend
            };
            // Convertir explícitamente a string para asegurar que no hay problemas de tipo
            postData.texto = String(postData.texto);
            
            console.log('Enviando comentario con datos:', JSON.stringify(postData));
            
            // Asegurar que la URL tiene una barra al final si es necesario
            const url = `${backendUrl}/comments_users/CommentsUserController.php?action=create`;
            console.log('URL de envío:', url);
            
            const response = await axios.post(
                url,
                postData,
                { 
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
            );
            console.log('Respuesta del servidor:', response.data);
            
            showNotification("Comentario publicado con éxito", "success");
            setNewComment('');
            fetchComments(selectedMessage.id); // Recargar la lista de comentarios
        } catch (error) {
            console.error("Error al publicar el comentario:", error);
            showNotification("Error al publicar el comentario", "error");
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para obtener las iniciales del usuario
    const getUserInitials = (username) => {
        // Protección adicional contra nulos o undefined
        if (!username) return 'U';
        return username.charAt(0).toUpperCase();
    };

    // Componente de notificación
    const Notification = () => {
        if (!notification.show) return null;
        
        const backgroundColor = 
            notification.type === 'success' ? '#4caf50' : 
            notification.type === 'warning' ? '#ff9800' : 
            notification.type === 'error' ? '#f44336' : '#2196f3';
        
        return (
            <div style={{...styles.notification, backgroundColor}}>
                {notification.message}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <Notification />
            <h1 style={styles.title}>Foro de la comunidad</h1>

            {/* Formulario para publicar mensaje */}
            <div style={styles.formContainer}>
                <form onSubmit={handlePostMessage}>
                    <div style={styles.flexRow}>
                        <div style={styles.avatar}>
                            {user ? getUserInitials(user.username) : '?'}
                        </div>
                        <div style={{flex: 1}}>
                            <p style={{fontWeight: 'bold', margin: '0'}}>
                                {user ? user.username : 'Cargando...'}
                            </p>
                        </div>
                    </div>
                    <textarea
                        placeholder="¿Qué estás pensando?"
                        style={styles.textField}
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!user}
                    />
                    <button 
                        type="submit"
                        style={{
                            ...styles.button, 
                            ...((!user || !newMessage.trim()) ? styles.disabledButton : {})
                        }}
                        disabled={!user || !newMessage.trim()}
                    >
                        Publicar
                    </button>
                </form>
            </div>

            <div style={styles.divider}></div>

            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>
                Últimas publicaciones
            </h2>

            {/* Lista de mensajes */}
            {loading ? (
                <div style={styles.loading}>
                    <p>Cargando mensajes...</p>
                </div>
            ) : messages.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', margin: '16px 0'}}>
                    No hay publicaciones todavía. ¡Sé el primero en publicar!
                </p>
            ) : (
                messages.map((message) => (
                    
                    <div key={message.id} style={styles.messageCard}>
                        {console.log(message)}
                        <div style={styles.flexRow}>
                            <div style={styles.avatar}>
                                {getUserInitials(message.username)}
                            </div>
                            <div>
                                <p style={styles.userName}>
                                    {message.username || 'Usuario'}
                                </p>
                                <p style={styles.date}>
                                    {formatDate(message.fecha)}
                                </p>
                            </div>
                        </div>

                        <p style={{margin: '16px 0'}}>
                            {message.contenido}
                        </p>

                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button 
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#666'
                                }}
                                onClick={() => handleMessageClick(message)}
                            >
                                Comentar
                            </button>
                            <button 
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#1976d2'
                                }}
                            >
                                Me gusta
                            </button>
                        </div>

                        {selectedMessage && selectedMessage.id === message.id && (
                            <div style={styles.commentSection}>
                                {/* Formulario para comentar */}
                                <form onSubmit={handlePostComment} style={{display: 'flex', marginBottom: '16px'}}>
                                    <input
                                        type="text"
                                        placeholder="Escribe un comentario..."
                                        style={{...styles.textField, marginBottom: 0, marginRight: '8px'}}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={!user}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            ...styles.button, 
                                            ...(!user || !newComment.trim() ? styles.disabledButton : {})
                                        }}
                                        disabled={!user || !newComment.trim()}
                                    >
                                        Enviar
                                    </button>
                                </form>

                                <div style={styles.divider}></div>
                                
                                {loadingComments ? (
                                    <div style={styles.loading}>
                                        <p>Cargando comentarios...</p>
                                    </div>
                                ) : comments.length === 0 ? (
                                    <p style={{textAlign: 'center', color: '#666', margin: '16px 0'}}>
                                        No hay comentarios todavía. ¡Sé el primero en comentar!
                                    </p>
                                ) : (
                                    <div>
                                        {comments.map((comment) => (
                                            <div key={comment.id} style={styles.commentCard}>
                                                <div style={styles.flexRow}>
                                                    <div style={styles.smallAvatar}>
                                                        {getUserInitials(comment.username)}
                                                    </div>
                                                    <div>
                                                        <p style={styles.userName}>
                                                            {comment.username || 'Usuario'}
                                                        </p>
                                                        <p style={styles.date}>
                                                            {formatDate(comment.fecha)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p style={{marginTop: '8px', fontSize: '14px'}}>
                                                    {comment.texto}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Foro;
