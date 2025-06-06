<?php

require_once __DIR__ . '/../../config/database.php';

class UpdateCodeProject {
    public function execute($id, $data) {
        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("UPDATE proyectos SET html=?, css=?, js=? WHERE id=?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }

        $stmt->bind_param(
            "sssi",
            $data['html'],
            $data['css'],
            $data['js'],
            $id
        );
        if ($stmt->execute()) {
            echo json_encode(["message" => "Proyecto actualizado con éxito"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar el proyecto"]);
        }
        $stmt->close();
    }
}