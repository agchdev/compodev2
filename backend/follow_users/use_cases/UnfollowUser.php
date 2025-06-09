<?php

require_once __DIR__ . '/../../config/database.php';

class UnfollowUser {
    public function execute($id_usu1, $id_usu2) {
        try {
            $db = new DB();
            $conn = $db->getConn();
            
            // Eliminar la relación de seguimiento entre usuarios
            $stmt = $conn->prepare("DELETE FROM seguidres_usuarios WHERE id_usu1 = ? AND id_usu2 = ?");
            if (!$stmt) {
                return false; // Error al preparar la consulta
            }
            
            $stmt->bind_param("ii", $id_usu1, $id_usu2);
            $result = $stmt->execute();
            $stmt->close();
            
            return $result;
        } catch (Exception $e) {
            // Registra el error pero devuelve false
            error_log("Error en UnfollowUser: " . $e->getMessage());
            return false;
        }
    }
}
