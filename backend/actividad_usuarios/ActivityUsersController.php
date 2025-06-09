<?php

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Controlador para gestionar operaciones relacionadas con las actividades de usuarios
 * 
 * Este controlador utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Ejemplo: ActivityUsersController.php?action=create
 */


require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/CreateActivityUser.php';
require_once __DIR__ . '/entities/ActivityUsers.php';
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

// Mapeo de acciones a métodos
switch ($action) {
    case 'create':
        if ($method === 'POST') {
            // Obtener datos del cuerpo de la solicitud
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($data['id_usuario']) || !isset($data['accion'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan datos requeridos']);
                exit;
            }
            
            $fecha = isset($data['fecha']) ? $data['fecha'] : date('Y-m-d');
            $id_referencia = isset($data['id_referencia']) ? $data['id_referencia'] : null;
            
            // Crear objeto de actividad
            $activity = new ActivityUsers(
                $data['id_usuario'],
                $data['accion'],
                $fecha,
                $id_referencia
            );
            
            // Guardar actividad
            $createActivityUser = new CreateActivityUser();
            $result = $createActivityUser->execute($activity);
            
            if ($result) {
                http_response_code(201);
                echo json_encode(['success' => true, 'id' => $activity->id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al registrar la actividad']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'getAll':
        if ($method === 'GET') {
            $db = new DB();
            $conn = $db->getConn();
            
            // Consulta para obtener todas las actividades con nombres de usuario
            $stmt = $conn->prepare("
                SELECT a.*, u.user 
                FROM actividad_usuarios a
                LEFT JOIN usuarios u ON a.id_usuario = u.id
                ORDER BY a.fecha DESC, a.id DESC
                LIMIT 100
            ");
            
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(['error' => 'Error al preparar la consulta']);
                exit;
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            
            $activities = [];
            while ($row = $result->fetch_assoc()) {
                $activities[] = $row;
            }
            
            $stmt->close();
            echo json_encode($activities);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción no reconocida']);
}