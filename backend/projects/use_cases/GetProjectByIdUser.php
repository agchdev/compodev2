<?php

require_once __DIR__ . '/../../config/database.php';

class GetProjectByIdUser {
    public function execute($id) {
        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("SELECT * FROM proyectos WHERE id_usuario = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            exit;
        }

        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $projects = [];
            
            // Obtener todos los proyectos en lugar de solo uno
            while ($project = $result->fetch_assoc()) {
                $projects[] = $project;
            }
            
            $stmt->close();
            
            if (count($projects) > 0) {
                echo json_encode($projects);
            } else {
                echo json_encode([]);
            }
        } else {
            $stmt->close();
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener los proyectos"]);
        }
    }
}
