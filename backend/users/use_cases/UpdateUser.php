<?php

require_once __DIR__ . '/../../config/database.php';

class UpdateUser {
    public function execute($data) {
        // Iniciar sesión si no está iniciada para acceder a $_SESSION
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Verificar que se proporciona un ID de usuario
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID de usuario requerido"]);
            return;
        }
        
        $id = $data['id'];
        $db = new DB();
        $conn = $db->getConn();
        
        // Primero, obtener los datos actuales del usuario
        $checkStmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
        if (!$checkStmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }
        
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "Usuario no encontrado"]);
            $checkStmt->close();
            return;
        }
        
        $currentUser = $result->fetch_assoc();
        $checkStmt->close();
        
        // Procesar la imagen si se subió una nueva
        $urlFoto = $currentUser['urlFoto']; // Valor actual por defecto
        
        if (isset($_FILES['urlFoto']) && $_FILES['urlFoto']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['urlFoto']['tmp_name'];
            $fileName = $_FILES['urlFoto']['name'];
            
            // Obtener la extensión del archivo
            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            
            // Crear directorio de uploads si no existe
            $uploadDir = __DIR__ . '/../../uploads/';
            
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            // Generar un nombre único para el archivo
            $nuevoNombreArchivo = $data['user'] . '_' . time() . '.' . $extension;
            $rutaCompleta = $uploadDir . $nuevoNombreArchivo;
            
            // Mover el archivo subido
            if (move_uploaded_file($tmpName, $rutaCompleta)) {
                $urlFoto = 'uploads/' . $nuevoNombreArchivo;
            } else {
                // Error al mover el archivo
                http_response_code(500);
                echo json_encode(["error" => "Error al subir la imagen"]);
                return;
            }
        }
        
        // Determinar si se actualiza la contraseña
        $passwordSet = isset($data['password']) && !empty($data['password']);
        
        // Construir la consulta SQL dinámicamente según los campos a actualizar
        if ($passwordSet) {
            $stmt = $conn->prepare("UPDATE usuarios SET user=?, email=?, password=?, urlFoto=?, descripcion=? WHERE id=?");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error al preparar la consulta"]);
                return;
            }
            
            // Hash de la nueva contraseña
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
            
            $stmt->bind_param(
                "sssssi",
                $data['user'],
                $data['email'],
                $hashedPassword,
                $urlFoto,
                $data['descripcion'],
                $id
            );
        } else {
            // Si no se actualiza la contraseña, no la incluimos en el UPDATE
            $stmt = $conn->prepare("UPDATE usuarios SET user=?, email=?, urlFoto=?, descripcion=? WHERE id=?");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error al preparar la consulta"]);
                return;
            }
            
            $stmt->bind_param(
                "ssssi",
                $data['user'],
                $data['email'],
                $urlFoto,
                $data['descripcion'],
                $id
            );
        }
        
        if ($stmt->execute()) {
            // Devolver los datos actualizados del usuario
            $updatedUser = [
                "id" => $id,
                "user" => $data['user'],
                "email" => $data['email'],
                "urlFoto" => $urlFoto,
                "descripcion" => $data['descripcion']
            ];
            
            echo json_encode([
                "message" => "Usuario actualizado con éxito",
                "user" => $updatedUser
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar el usuario: " . $conn->error]);
        }
        
        $stmt->close();
    }
}
