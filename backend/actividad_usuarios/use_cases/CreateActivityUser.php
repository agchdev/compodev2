<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/ActivityUsers.php';

class CreateActivityUser {
    public function execute(ActivityUsers $activity) {
        $db = new DB();
        $conn = $db->getConn();
        
        try {
            $stmt = $conn->prepare("
                INSERT INTO actividad_usuarios 
                (id_usuario, accion, fecha) 
                VALUES (?, ?, ?)
            ");
            
            if (!$stmt) {
                error_log("Error al preparar la consulta: " . $conn->error);
                return false;
            }
            
            $stmt->bind_param(
                "iss", 
                $activity->id_usuario, 
                $activity->accion, 
                $activity->fecha, 
            );
            
            $result = $stmt->execute();
            
            if (!$result) {
                error_log("Error al ejecutar la consulta: " . $stmt->error);
                return false;
            }
            
            $activity->id = $conn->insert_id;
            $stmt->close();
            
            return true;
        } catch (Exception $e) {
            error_log("Error al registrar actividad: " . $e->getMessage());
            return false;
        }
    }
}
