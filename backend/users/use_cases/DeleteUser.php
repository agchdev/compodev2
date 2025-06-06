<?php

require_once __DIR__ . '/../../config/database.php';

class DeleteUser {
    public function execute($id) {
        $db = new DB();
        $conn = $db->getConn();
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Usuario eliminado con éxito"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar el usuario"]);
        }
        $stmt->close();
    }
}
