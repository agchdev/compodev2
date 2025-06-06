<?php

require_once __DIR__ . '/../../config/database.php';

class LoginUser {
    public function execute($username, $password) {
        // Iniciar sesión si no está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $db = new DB();
        $conn = $db->getConn();
        
        // Buscar usuario por nombre de usuario
        $stmt = $conn->prepare('SELECT * FROM usuarios WHERE user = ?');
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return null;
        }
        
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Verificar si el usuario existe
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
            $stmt->close();
            return null;
        }
        
        $user = $result->fetch_assoc();
        $stmt->close();
        
        // Verificar la contraseña hasheada usando password_verify
        if (!password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
            return null;
        }
        
        // Guardar ID del usuario en la sesión
        $_SESSION["id"] = $user["id"];
        
        // Eliminar la contraseña antes de devolver los datos del usuario
        unset($user['password']);
        
        // Devolver respuesta exitosa
        echo json_encode([
            "success" => true,
            "message" => "Inicio de sesión exitoso",
            "user" => $user
        ]);
        
        return $user;
    }
}