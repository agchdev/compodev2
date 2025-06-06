<?php

require_once __DIR__ . '/../../config/database.php';

/**
 * Caso de uso para eliminar un comentario existente
 */
class DeleteCommentsUser {
    /**
     * Ejecuta el caso de uso para eliminar un comentario
     * 
     * @param int $id ID del comentario a eliminar
     * @return void
     */
    public function execute($id) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Verificar primero si el comentario existe
            $checkSql = "SELECT id FROM comentarios_usuarios WHERE id = ?";
            $checkStmt = $conn->prepare($checkSql);
            $checkStmt->bind_param("i", $id);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows === 0) {
                $checkStmt->close();
                $conn->close();
                http_response_code(404);
                echo json_encode(['error' => 'Comentario no encontrado']);
                return;
            }
            
            $checkStmt->close();
            
            // Preparar la consulta SQL para eliminar el comentario
            $sql = "DELETE FROM comentarios_usuarios WHERE id = ?";
                    
            $stmt = $conn->prepare($sql);
            
            // Vincular el parámetro
            $stmt->bind_param("i", $id);
            
            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Cerrar la conexión
                $stmt->close();
                $conn->close();
                
                // Devolver respuesta exitosa
                http_response_code(200);
                echo json_encode(['message' => 'Comentario eliminado con éxito']);
            } else {
                throw new Exception("Error al eliminar el comentario: " . $stmt->error);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
