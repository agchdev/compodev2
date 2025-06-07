<?php


require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/CreateMessagesUser.php';
require_once __DIR__ . '/use_cases/GetAllMessagesUser.php';
require_once __DIR__ . '/use_cases/GetMessagesUserById.php';
require_once __DIR__ . '/use_cases/UpdateMessagesUser.php';
require_once __DIR__ . '/use_cases/DeleteMessagesUser.php';

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

// Mapeo de acciones a métodos
switch ($action) {
    case 'create':
        if ($method === 'POST') {
            // Obtener los datos enviados en formato JSON
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }

            // Verificar que estén todos los campos requeridos
            if (!isset($data['texto']) || !isset($data['id_usuario']) || !isset($data['recurso'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan campos requeridos (texto, id_usuario, recurso)']);
                exit;
            }

            // Si no se proporciona fecha, se usa la fecha actual
            if (!isset($data['fecha'])) {
                $data['fecha'] = date('Y-m-d H:i:s');
            }

            // Crear un nuevo mensaje
            $useCase = new CreateMessagesUser();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
        case 'all':
            if ($method === 'GET') {
                error_log("[MessagesUserController] Acción 'all' iniciada");
        
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
                $search = isset($_GET['search']) ? $_GET['search'] : null;
                $itemsPerPage = isset($_GET['itemsPerPage']) ? intval($_GET['itemsPerPage']) : 0;
        
                error_log("[MessagesUserController] Parámetros: page=$page, search=" . var_export($search, true) . ", itemsPerPage=$itemsPerPage");
        
                try {
                    $useCase = new GetAllMessagesUser();
                    $result = $useCase->execute($page, $search, $itemsPerPage);
        
                    if (ob_get_length()) ob_clean();
        
                    if (isset($result['error'])) {
                        error_log("[MessagesUserController] Error recibido desde GetAllMessagesUser: " . $result['error']);
                        http_response_code(500);
                        echo json_encode(['error' => $result['error']], JSON_UNESCAPED_UNICODE);
                    } else {
                        error_log("[MessagesUserController] Mensajes obtenidos correctamente: " . count($result['data']) . " resultados.");
                        echo json_encode($result, JSON_UNESCAPED_UNICODE);
                    }
                } catch (Exception $e) {
                    error_log("[MessagesUserController] Excepción no controlada: " . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Excepción en servidor: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
        
        
    case 'get':
        if ($method === 'GET') {
            // Verificar que se haya proporcionado un ID
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del mensaje']);
                exit;
            }
            
            // Obtener el ID y obtener el mensaje
            $id = intval($_GET['id']);
            $useCase = new GetMessagesUserById();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'update':
        if ($method === 'PUT' || $method === 'POST') { // Permitir POST para compatibilidad
            // Verificar que se haya proporcionado un ID
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del mensaje']);
                exit;
            }
            
            // Obtener el ID y los datos a actualizar
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            
            // Actualizar el mensaje
            $useCase = new UpdateMessagesUser();
            $useCase->execute($id, $data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'delete':
        if ($method === 'DELETE' || $method === 'POST') { // Permitir POST para compatibilidad
            // Verificar que se haya proporcionado un ID
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del mensaje']);
                exit;
            }
            
            // Obtener el ID y eliminar el mensaje
            $id = intval($_GET['id']);
            $useCase = new DeleteMessagesUser();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada: ' . $action]);
        break;
}