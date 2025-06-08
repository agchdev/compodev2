import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Foro.css';
import '../styles/AnimatedBackground.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Sistema de notificación personalizado
    const showNotification = useCallback((message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    }, []);

    // Obtener los últimos 10 mensajes
    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}/messages_users/MessagesUserController.php?action=all`,
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
    }, [showNotification]);

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
    }, [navigate, fetchMessages]);





    // Obtener comentarios de un mensaje
    const fetchComments = async (messageId) => {
        try {
            setLoadingComments(true);
            const response = await axios.get(
                `${backendUrl}/comments_users/CommentsUserController.php?action=byMessage&id_mensaje=${messageId}`,
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
                `${backendUrl}/messages_users/MessagesUserController.php?action=create`,
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

    return (
        <div className="foro-container">
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

            <h1 className="foro-title">Foro de CompoDev</h1>

            {/* Formulario para crear un nuevo mensaje */}
            <div className="form-container">
                <form onSubmit={handlePostMessage} className="foro-form">
                    <textarea
                        placeholder="¿Qué quieres compartir?"
                        className="foro-textarea"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!user}
                        rows="3"
                    ></textarea>
                    <button
                        type="submit"
                        className="foro-submit-btn"
                        disabled={!user || !newMessage.trim()}
                    >
                        Publicar mensaje
                    </button>
                </form>
            </div>

            <div className="foro-divider"></div>

            <h2 className="section-title">
                Últimas publicaciones
            </h2>

            {/* Mensajes */}
            <div className="messages-container">
                {loading ? (
                    <div className="loading-state">
                        <p>Cargando mensajes...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay mensajes todavía.</p>
                        <p>¡Sé el primero en publicar!</p>
                    </div>
                ) : (
                    messages.map((message) => (

                        <div key={message.id} className="message-card">
                            <div className="flex-row">
                                <div className="user-avatar">
                                    {getUserInitials(message.username)}
                                </div>
                                <div>
                                    <p className="user-name">
                                        {message.username || 'Usuario'}
                                    </p>
                                    <p className="post-date">
                                        {formatDate(message.fecha)}
                                    </p>
                                </div>
                            </div>

                            <p className="message-text">
                                {message.texto}
                            </p>

                            <div className="message-actions">
                                <button
                                    className="action-button comment-button"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    Comentar
                                </button>
                            </div>

                            {selectedMessage && selectedMessage.id === message.id && (
                                <div className="comments-section">
                                    {/* Formulario para comentar */}
                                    <form onSubmit={handlePostComment} className="comment-form">
                                        <input
                                            type="text"
                                            placeholder="Escribe un comentario..."
                                            className="comment-input"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            disabled={!user}
                                        />
                                        <button
                                            type="submit"
                                            className="comment-submit-btn"
                                            disabled={!user || !newComment.trim()}
                                        >
                                            Enviar
                                        </button>
                                    </form>

                                    <div className="comments-divider"></div>

                                    {loadingComments ? (
                                        <div className="loading-state">
                                            <p>Cargando comentarios...</p>
                                        </div>
                                    ) : comments.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No hay comentarios todavía.</p>
                                            <p>¡Sé el primero en comentar!</p>
                                        </div>
                                    ) : (
                                        <div className="comments-list">
                                            {comments.map((comment) => (
                                                <div key={comment.id} className="comment-card">
                                                    <div className="comment-header">
                                                        <div className="comment-avatar">
                                                            {getUserInitials(comment.username)}
                                                        </div>
                                                        <div className="comment-user-info">
                                                            <p className="comment-username">
                                                                {comment.username || 'Usuario'}
                                                            </p>
                                                            <p className="comment-date">
                                                                {formatDate(comment.fecha)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="comment-text">
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

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default Foro;
