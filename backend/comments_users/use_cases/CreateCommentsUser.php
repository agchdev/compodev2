<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/CommentsUser.php';

/**
 * Caso de uso para crear un nuevo comentario de usuario
 */
class CreateCommentsUser {
    /**
     * Ejecuta el caso de uso para crear un comentario
     * 
     * @param array $data Los datos del comentario a crear
     * @return void
     */
    public function execute($data) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Crear una nueva instancia de CommentsUser con los datos proporcionados
            $commentsUser = new CommentsUser(
                $data['texto'],
                $data['id_mensaje'],
                $data['id_usuario'],
                isset($data['fecha']) ? $data['fecha'] : date('Y-m-d H:i:s'),
                $data['recurso']
            );

            // Preparar la consulta SQL para insertar el comentario
            $sql = "INSERT INTO comentarios_usuarios (texto, id_mensaje, id_usuario, fecha, recurso) 
                    VALUES (?, ?, ?, ?, ?)";
                    
            $stmt = $conn->prepare($sql);
            
            // Asegurar que el texto sea tratado como string
            $texto = (string) $commentsUser->texto;
            $id_mensaje = (int) $commentsUser->id_mensaje;
            $id_usuario = (int) $commentsUser->id_usuario;
            $fecha = (string) $commentsUser->fecha;
            $recurso = (string) $commentsUser->recurso;
            
            // Registro para depuración
            error_log("Texto a insertar: '{$texto}'");
            error_log("ID mensaje: {$id_mensaje}");
            error_log("ID usuario: {$id_usuario}");
            
            // Vincular los parámetros
            $stmt->bind_param(
                "siiss",
                $texto,
                $id_mensaje,
                $id_usuario,
                $fecha,
                $recurso
            );
            
            // Registrar los datos recibidos para diagnóstico
            error_log('Intentando crear comentario con datos: ' . print_r($data, true));
            
            try {
                // Ejecutar la consulta
                if ($stmt->execute()) {
                    $commentsUser->id = $conn->insert_id;
                    // Cerrar la conexión
                    $stmt->close();
                    $conn->close();
                    
                    // Devolver respuesta exitosa con el ID generado
                    http_response_code(201);
                    echo json_encode([
                        'message' => 'Comentario creado con éxito', 
                        'id' => $commentsUser->id
                    ]);
                    
                } else {
                    error_log('Error en la consulta SQL: ' . $stmt->error);
                    throw new Exception("Error al crear el comentario: " . $stmt->error);
                }
            } catch (Exception $queryEx) {
                error_log('Excepción al ejecutar la consulta: ' . $queryEx->getMessage());
                throw $queryEx;
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
