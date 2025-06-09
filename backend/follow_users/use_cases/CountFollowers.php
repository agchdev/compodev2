<?php

require_once __DIR__ . '/../../config/database.php';

class CountFollowers {
    public function execute($id_usuario) {
        $db = new DB();
        $conn = $db->getConn();
        
        // Contar el número de seguidores de un usuario (usuarios que le siguen a él)
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM seguidres_usuarios WHERE id_usu2 = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return 0;
        }
        
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        $stmt->close();
        
        return $data['total'];
    }
}
