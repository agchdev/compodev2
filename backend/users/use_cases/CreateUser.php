<?php

require_once __DIR__ . '/../../config/database.php';
require_once(__DIR__ . '/../entities/User.php');

class CreateUser {
    public function execute($data) {
        // Configurar una URL de foto predeterminada
        $urlFoto = 'default.jpg';
        $rutaCompleta = null;
        
        // Verificar si hay un archivo subido
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
                echo json_encode(["status" => "error", "message" => "Error al subir la imagen"]);
                exit;
            }
        }
        
        // Crear el objeto usuario con la URL de la foto
        // Añadir la fecha de registro actual
        $fechaRegistro = date('Y-m-d H:i:s');
        
        $user = new User(
            $data['user'],
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $urlFoto,
            $data['descripcion'],
            $fechaRegistro
        );

        $db = new DB();
        $conn = $db->getConn();

        $stmt = $conn->prepare("INSERT INTO usuarios (user, email, password, urlFoto, descripcion, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Error al preparar la consulta"]);
            return;
        }
        $stmt->bind_param(
            "ssssss",
            $user->user,
            $user->email,
            $user->password,
            $user->urlFoto,
            $user->descripcion,
            $user->fechaRegistro
        );
        if ($stmt->execute()) {
            echo json_encode(["message" => "Usuario creado con éxito"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al insertar el usuario"]);
        }
        $stmt->close();
    }
}
