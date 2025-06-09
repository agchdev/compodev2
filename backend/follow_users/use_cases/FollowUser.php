<?php

require_once __DIR__ . '/../../config/database.php';

class FollowUser {
    public function execute($id_usu1, $id_usu2) {
        try {
            $db = new DB();
            $conn = $db->getConn();

            // Verificar si ya existe la relación
            $checkStmt = $conn->prepare("SELECT id FROM seguidres_usuarios WHERE id_usu1 = ? AND id_usu2 = ?");
            if (!$checkStmt) {
                return false; // Error al preparar la consulta
            }

            $checkStmt->bind_param("ii", $id_usu1, $id_usu2);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();

            if ($checkResult->num_rows > 0) {
                $checkStmt->close();
                // Ya existe la relación
                return false;
            }
            $checkStmt->close();

            // Insertar la relación
            $stmt = $conn->prepare("INSERT INTO seguidres_usuarios (id_usu1, id_usu2, tiempo) VALUES (?, ?, CURDATE())");
            if (!$stmt) {
                return false; // Error al preparar la consulta
            }

            $stmt->bind_param("ii", $id_usu1, $id_usu2);
            $result = $stmt->execute();
            $stmt->close();

            return $result;
        } catch (Exception $e) {
            // Registra el error pero devuelve false
            error_log("Error en FollowUser: " . $e->getMessage());
            return false;
        }
    }
}
