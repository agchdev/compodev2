<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/CommentsUser.php';

/**
 * Caso de uso para obtener un comentario específico por su ID
 */
class GetCommentsUserById {
    /**
     * Ejecuta el caso de uso para obtener un comentario por ID
     * 
     * @param int $id ID del comentario a obtener
     * @return void
     */
    public function execute($id) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Preparar la consulta SQL para obtener el comentario
            $sql = "SELECT * FROM comentarios_usuarios WHERE id = ?";
                    
            $stmt = $conn->prepare($sql);
            
            // Vincular el parámetro
            $stmt->bind_param("i", $id);
            
            // Ejecutar la consulta
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $comment = $result->fetch_assoc();
                
                // Cerrar la conexión
                $stmt->close();
                $conn->close();
                
                // Devolver el comentario encontrado
                http_response_code(200);
                echo json_encode($comment);
            } else {
                // No se encontró el comentario
                http_response_code(404);
                echo json_encode(['error' => 'Comentario no encontrado']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
