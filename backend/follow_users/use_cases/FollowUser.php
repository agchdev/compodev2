<?php

require_once __DIR__ . '/../../config/database.php';

class FollowUser {
    public function execute($id_usuario, $id_proyecto) {
        $db = new DB();
        $conn = $db->getConn();
        
        // Verificar si ya existe la relación de seguimiento
        $checkStmt = $conn->prepare("SELECT id FROM seguidores_usuarios WHERE id_usuario = ? AND id_proyecto = ?");
        if (!$checkStmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return false;
        }
        
        $checkStmt->bind_param("ii", $id_usuario, $id_proyecto);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $checkStmt->close();
            http_response_code(400);
            echo json_encode(["error" => "Ya sigues a este usuario"]);
            return false;
        }
        $checkStmt->close();
        
        // Crear la relación de seguimiento
        $stmt = $conn->prepare("INSERT INTO seguidores_usuarios (id_usuario, id_proyecto) VALUES (?, ?)");
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
            echo json_encode(["error" => "Error al seguir al usuario"]);
            return false;
        }
    }
}
