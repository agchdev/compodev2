<?php

require_once __DIR__ . '/../../config/database.php';

class GetUserById {
    public function execute($id) {
        $db = new DB();
        $conn = $db->getConn();
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }
}
