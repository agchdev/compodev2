<?php

require_once __DIR__ . '/../../config/database.php';

class LogoutUser {
    public function execute() {
        // Iniciar sesión si no está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Cerrar sesión
        session_unset();
        session_destroy();
        
        echo json_encode([
            "status" => "success",
            "message" => "Sesión cerrada"
        ]);
    }
}
