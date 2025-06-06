<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/MessagesUser.php';

/**
 * Caso de uso para obtener un mensaje específico por su ID
 */
class GetMessagesUserById {
    /**
     * Ejecuta el caso de uso para obtener un mensaje por ID
     * 
     * @param int $id ID del mensaje a obtener
     * @return void
     */
    public function execute($id) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Preparar la consulta SQL para obtener el mensaje
            $sql = "SELECT * FROM mensajes_usuarios WHERE id = ?";
                    
            $stmt = $conn->prepare($sql);
            
            // Vincular el parámetro
            $stmt->bind_param("i", $id);
            
            // Ejecutar la consulta
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $message = $result->fetch_assoc();
                
                // Cerrar la conexión
                $stmt->close();
                $conn->close();
                
                // Devolver el mensaje encontrado
                http_response_code(200);
                echo json_encode($message);
            } else {
                // No se encontró el mensaje
                http_response_code(404);
                echo json_encode(['error' => 'Mensaje no encontrado']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
