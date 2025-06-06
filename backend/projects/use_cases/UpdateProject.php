<?php

require_once __DIR__ . '/../../config/database.php';

class UpdateProject {
    public function execute($id, $data) {
        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("UPDATE proyectos SET titulo=?, html=?, css=?, js=?, descripcion_proyecto=?, categoria=? WHERE id=?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }
        $stmt->bind_param(
            "ssssssi",
            $data['titulo'],
            $data['html'],
            $data['css'],
            $data['js'],
            $data['descripcion_proyecto'],
            $data['categoria'],
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
