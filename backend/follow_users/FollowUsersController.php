<?php

require_once __DIR__ . '/use_cases/FollowUser.php';
require_once __DIR__ . '/use_cases/UnfollowUser.php';
require_once __DIR__ . '/use_cases/GetFollowedUsers.php';
require_once __DIR__ . '/use_cases/CountFollowers.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Permitir cualquier origen durante el desarrollo

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
// Manejar solicitudes preflight OPTIONS
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Para solicitudes normales, establecer el tipo de contenido JSON
header("Content-Type: application/json; charset=UTF-8");

// Verificar que se haya proporcionado una acción
if (!isset($_GET['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se ha especificado ninguna acción']);
    exit;
}

$action = $_GET['action'];

switch ($action) {
    case 'follow':
        // Obtener los datos del cuerpo de la petición
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Verificar que se hayan proporcionado los IDs necesarios
        if (!isset($data['id_usu1']) || !isset($data['id_usu2'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan parámetros requeridos (id_usu1 y id_usu2)']);
            exit;
        }
        
        try {
            // Crear instancia de caso de uso y ejecutar
            $useCase = new FollowUser();
            $result = $useCase->execute($data['id_usu1'], $data['id_usu2']);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario seguido correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'No se pudo seguir al usuario'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    case 'unfollow':
        // Obtener los datos del cuerpo de la petición
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Verificar que se hayan proporcionado los IDs necesarios
        if (!isset($data['id_usu1']) || !isset($data['id_usu2'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan parámetros requeridos (id_usu1 y id_usu2)']);
            exit;
        }
        
        try {
            // Crear instancia de caso de uso y ejecutar
            $useCase = new UnfollowUser();
            $result = $useCase->execute($data['id_usu1'], $data['id_usu2']);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario dejado de seguir correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'No se pudo dejar de seguir al usuario'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    case 'getFollowed':
        // Verificar que se haya proporcionado el ID del usuario
        if (!isset($_GET['userId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el parámetro userId']);
            exit;
        }
        
        $userId = intval($_GET['userId']);
        
        try {
            // Crear instancia de caso de uso y ejecutar
            $useCase = new GetFollowedUsers();
            $followedUsers = $useCase->execute($userId);
            
            echo json_encode($followedUsers);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    case 'countFollowers':
        // Verificar que se haya proporcionado el ID del usuario
        if (!isset($_GET['userId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el parámetro userId']);
            exit;
        }
        
        $userId = intval($_GET['userId']);
        
        try {
            // Crear instancia de caso de uso y ejecutar
            $useCase = new CountFollowers();
            $count = $useCase->execute($userId);
            
            echo json_encode([
                'success' => true,
                'count' => $count
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'count' => 0
            ]);
        }
        break;
    
    case 'countFollowing':
        // Verificar que se haya proporcionado el ID del usuario
        if (!isset($_GET['userId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el parámetro userId']);
            exit;
        }
        
        $userId = intval($_GET['userId']);
        
        try {
            // Crear una consulta SQL para contar cuántos usuarios sigue este usuario
            require_once __DIR__ . '/../config/database.php';
            $db = new DB();
            $conn = $db->getConn();
            
            $stmt = $conn->prepare('SELECT COUNT(*) as total FROM seguidres_usuarios WHERE id_usu1 = ?');
            if (!$stmt) {
                throw new Exception('Error preparando la consulta');
            }
            
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $count = isset($row['total']) ? intval($row['total']) : 0;
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'count' => $count
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'count' => 0
            ]);
        }
        break;
        
    default:
        // Acción no reconocida
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida: ' . $action]);
        break;
}