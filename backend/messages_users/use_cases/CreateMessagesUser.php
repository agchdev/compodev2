<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/MessagesUser.php';

/**
 * Caso de uso para crear un nuevo mensaje de usuario
 */
class CreateMessagesUser {
    /**
     * Ejecuta el caso de uso para crear un mensaje
     * 
     * @param array $data Los datos del mensaje a crear
     * @return void
     */
    public function execute($data) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Crear una nueva instancia de MessagesUser con los datos proporcionados
            $messagesUser = new MessagesUser(
                $data['texto'],
                $data['id_usuario'],
                isset($data['fecha']) ? $data['fecha'] : date('Y-m-d H:i:s'),
                $data['recurso']
            );
            
            // Preparar la consulta SQL para insertar el mensaje
            $sql = "INSERT INTO mensajes_usuarios (texto, id_usuario, fecha, recurso) 
                    VALUES (?, ?, ?, ?)";
                    
            $stmt = $conn->prepare($sql);
            
            // Vincular los parámetros
            $stmt->bind_param(
                "siss",
                $messagesUser->texto,
                $messagesUser->id_usuario,
                $messagesUser->fecha,
                $messagesUser->recurso
            );
            
            // Ejecutar la consulta
            if ($stmt->execute()) {
                $messagesUser->id = $conn->insert_id;
                
                // Cerrar la conexión
                $stmt->close();
                $conn->close();
                
                // Devolver respuesta exitosa con el ID generado
                http_response_code(201);
                echo json_encode([
                    'message' => 'Mensaje creado con éxito', 
                    'id' => $messagesUser->id
                ]);
                
            } else {
                throw new Exception("Error al crear el mensaje: " . $stmt->error);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
