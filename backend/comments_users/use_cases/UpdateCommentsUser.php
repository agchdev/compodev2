<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/CommentsUser.php';

/**
 * Caso de uso para actualizar un comentario existente
 */
class UpdateCommentsUser {
    /**
     * Ejecuta el caso de uso para actualizar un comentario
     * 
     * @param int $id ID del comentario a actualizar
     * @param array $data Los nuevos datos para el comentario
     * @return void
     */
    public function execute($id, $data) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Verificar primero si el comentario existe
            $checkSql = "SELECT * FROM comentarios_usuarios WHERE id = ?";
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
            
            // Construir la consulta SQL dinámica para actualizar solo los campos proporcionados
            $updateFields = [];
            $params = [];
            $types = "";
            
            if (isset($data['texto'])) {
                $updateFields[] = "texto = ?";
                $params[] = $data['texto'];
                $types .= "s";
            }
            
            if (isset($data['id_mensaje'])) {
                $updateFields[] = "id_mensaje = ?";
                $params[] = $data['id_mensaje'];
                $types .= "i";
            }
            
            if (isset($data['id_usuario'])) {
                $updateFields[] = "id_usuario = ?";
                $params[] = $data['id_usuario'];
                $types .= "i";
            }
            
            if (isset($data['fecha'])) {
                $updateFields[] = "fecha = ?";
                $params[] = $data['fecha'];
                $types .= "s";
            }
            
            if (isset($data['recurso'])) {
                $updateFields[] = "recurso = ?";
                $params[] = $data['recurso'];
                $types .= "s";
            }
            
            // Si no hay campos para actualizar, salir
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No se proporcionaron campos para actualizar']);
                return;
            }
            
            // Construir la consulta SQL completa
            $sql = "UPDATE comentarios_usuarios SET " . implode(", ", $updateFields) . " WHERE id = ?";
            
            // Añadir el ID al final de los parámetros
            $params[] = $id;
            $types .= "i";
            
            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                $stmt->close();
                $conn->close();
                
                http_response_code(200);
                echo json_encode(['message' => 'Comentario actualizado con éxito']);
            } else {
                throw new Exception("Error al actualizar el comentario: " . $stmt->error);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
