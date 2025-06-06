<?php

require_once __DIR__ . '/../../config/database.php';

class GetProjectById {
    public function execute($id) {
        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("SELECT * FROM proyectos WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["error" => "Error al preparar la consulta", "status" => 500]);
        }

        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $project = $result->fetch_assoc();
            $stmt->close();

            if ($project) {
                echo json_encode(["message" => "Proyecto obtenido con éxito", "project" => $project, "status" => 200]);
            } else {
                echo json_encode(["error" => "Proyecto no encontrado", "status" => 404]);
            }
        } else {
            $stmt->close();
            echo json_encode(["error" => "Error al obtener el proyecto", "status" => 500]);
        }
    }
}
