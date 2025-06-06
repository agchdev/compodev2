<?php

require_once __DIR__ . '/../../config/database.php';

/**
 * Caso de uso para eliminar un mensaje existente
 */
class DeleteMessagesUser {
    /**
     * Ejecuta el caso de uso para eliminar un mensaje
     * 
     * @param int $id ID del mensaje a eliminar
     * @return void
     */
    public function execute($id) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Verificar primero si el mensaje existe
            $checkSql = "SELECT id FROM mensajes_usuarios WHERE id = ?";
            $checkStmt = $conn->prepare($checkSql);
            $checkStmt->bind_param("i", $id);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows === 0) {
                $checkStmt->close();
                $conn->close();
                http_response_code(404);
                echo json_encode(['error' => 'Mensaje no encontrado']);
                return;
            }
            
            $checkStmt->close();
            
            // Preparar la consulta SQL para eliminar el mensaje
            $sql = "DELETE FROM mensajes_usuarios WHERE id = ?";
                    
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
                echo json_encode(['message' => 'Mensaje eliminado con éxito']);
            } else {
                throw new Exception("Error al eliminar el mensaje: " . $stmt->error);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
