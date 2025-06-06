<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/CommentsUser.php';

/**
 * Caso de uso para obtener comentarios asociados a un mensaje específico
 */
class GetCommentsByMessage {
    /**
     * Ejecuta el caso de uso para obtener comentarios por ID de mensaje
     * 
     * @param int $messageId ID del mensaje del que queremos obtener los comentarios
     * @param int $page Número de página para paginación
     * @param int $itemsPerPage Número de elementos por página
     * @return void
     */
    public function execute($messageId, $page = 1, $itemsPerPage = 10) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Calcular el offset para la paginación
            $offset = ($page - 1) * $itemsPerPage;
            
            // Preparar la consulta SQL para obtener los comentarios del mensaje con datos completos del usuario
            // Usamos el campo id_mensaje para relacionar con el ID del mensaje
            $sql = "SELECT c.*, u.username, u.avatar, u.email, u.descripcion, u.fecha_registro 
                    FROM comentarios_usuarios c 
                    LEFT JOIN usuarios u ON c.id_usuario = u.id 
                    WHERE c.id_mensaje = ? 
                    ORDER BY c.fecha DESC 
                    LIMIT ?, ?";
            
            // Consulta para obtener el total de comentarios
            $countSql = "SELECT COUNT(*) as total FROM comentarios_usuarios WHERE id_mensaje = ?";
            
            // Ejecutar consulta para obtener el total
            $countStmt = $conn->prepare($countSql);
            $countStmt->bind_param("i", $messageId);
            $countStmt->execute();
            $countResult = $countStmt->get_result();
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow['total'];
            $countStmt->close();
            
            // Ejecutar la consulta principal
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iii", $messageId, $offset, $itemsPerPage);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Procesar los resultados
            $comments = [];
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
            
            // Cerrar la conexión
            $stmt->close();
            $conn->close();
            
            // Calcular metadatos de paginación
            $totalPages = ceil($total / $itemsPerPage);
            
            // Preparar respuesta
            $response = [
                'data' => $comments,
                'pagination' => [
                    'total' => $total,
                    'totalPages' => $totalPages,
                    'currentPage' => $page,
                    'itemsPerPage' => $itemsPerPage
                ]
            ];
            
            // Devolver respuesta en formato JSON
            http_response_code(200);
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
