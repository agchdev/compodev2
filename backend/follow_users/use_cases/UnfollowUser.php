<?php

require_once __DIR__ . '/../../config/database.php';

class UnfollowUser {
    public function execute($id_usuario, $id_proyecto) {
        $db = new DB();
        $conn = $db->getConn();
        
        // Eliminar la relación de seguimiento entre usuarios
        $stmt = $conn->prepare("DELETE FROM seguidores_usuarios WHERE id_usuario = ? AND id_proyecto = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return false;
        }
        
        $stmt->bind_param("ii", $id_usuario, $id_proyecto);
        $result = $stmt->execute();
        $stmt->close();
        
        if ($result) {
            return true;
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar el seguimiento"]);
            return false;
        }
    }
}
