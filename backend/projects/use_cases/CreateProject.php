<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/Project.php';

class CreateProject {
    public function execute($data) {
        $project = new Project(
            $data['titulo'],
            $data['html'],
            $data['css'],
            $data['js'],
            $data['descripcion_proyecto'],
            $data['categoria'],
            $data['user']
        );

        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("
            INSERT INTO proyectos (titulo, html, css, js, descripcion_proyecto, categoria, id_usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }

        $stmt->bind_param(
            "ssssssi",
            $project->titulo,
            $project->html,
            $project->css,
            $project->js,
            $project->descripcion_proyecto,
            $project->categoria,
            $project->id_usuario,
        );

        if ($stmt->execute()) {
            // Obtener el ID del proyecto recién insertado
            $projectId = $conn->insert_id;
            
            // Agregar el ID al objeto de proyecto
            $project->id = $projectId;
            
            echo json_encode(["message" => "Proyecto creado con éxito", "proyecto" => $project, "id" => $projectId]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al insertar el proyecto"]);
        }

        $stmt->close();
    }
}
