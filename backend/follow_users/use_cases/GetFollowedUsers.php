<?php

require_once __DIR__ . '/../../config/database.php';

class GetFollowedUsers {
    public function execute($id_usuario) {
        $db = new DB();
        $conn = $db->getConn();
        
        // Obtener todos los datos de las personas que sigue un usuario
        $stmt = $conn->prepare("
            SELECT u.* 
            FROM users u
            INNER JOIN seguidores_usuarios f ON u.id = f.id_proyecto
            WHERE f.id_usuario = ?
        ");
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return [];
        }
        
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }
        
        $stmt->close();
        return $users;
    }
}
