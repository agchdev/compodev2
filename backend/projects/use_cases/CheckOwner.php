<?php

require_once __DIR__ . '/../../config/database.php';

class CheckOwner {
    public function execute($id, $id_usuario) {
        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("SELECT * FROM proyectos WHERE id = ? AND id_usuario = ?");
        if (!$stmt) {
            echo json_encode(["error" => "Error al preparar la consulta", "status" => 500]);
        }

        $stmt->bind_param("ii", $id, $id_usuario);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $project = $result->fetch_assoc();
            $stmt->close();
            
            if ($project) {
                echo json_encode(["message" => "El usuario es dueño del proyecto", "status" => 200]);
            } else {
                echo json_encode(["error" => "El usuario no es dueño del proyecto", "status" => 403]);
            }
        } else {
            $stmt->close();
            echo json_encode(["error" => "Error al verificar el dueño del proyecto", "status" => 500]);
        }
    }
}
