<?php

/**
 * Controlador para gestionar operaciones relacionadas con usuarios
 * 
 * Este controlador utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Ejemplo: UserController.php?action=login
 * Este enfoque simplifica las rutas y evita problemas de CORS y configuración del servidor.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/CreateUser.php';
require_once __DIR__ . '/use_cases/GetAllUsers.php';
require_once __DIR__ . '/use_cases/GetUserById.php';
require_once __DIR__ . '/use_cases/UpdateUser.php';
require_once __DIR__ . '/use_cases/DeleteUser.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Configuración de CORS para desarrollo
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
            // Comprobar si es una solicitud multipart/form-data o JSON
            $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
            
            // Inicializar array de datos
            $data = [];
            
            // Si es multipart/form-data (contiene archivos)
            if (strpos($contentType, 'multipart/form-data') !== false) {
                // Obtener datos del formulario POST
                $data = $_POST;
                
                // Si no hay datos en POST, devolver error
                if (empty($data)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'No se recibieron datos del formulario']);
                    exit;
                }
            } else {
                // Si es JSON normal
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Datos inválidos']);
                    exit;
                }
            }
            
            // Validar que todos los campos requeridos estén presentes
            if (!isset($data['user']) || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan campos requeridos (user, email, password)']);
                exit;
            }
            
            // Establecer valores predeterminados para campos opcionales
            if (!isset($data['descripcion'])) {
                $data['descripcion'] = 'Sin descripción';
            }
            
            // Ejecutar el caso de uso y capturar la salida
            ob_start();
            $useCase = new CreateUser();
            $useCase->execute($data);
            $response = ob_get_clean();
            
            // Devolver la respuesta al cliente
            echo $response;
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
    
    case 'session':
        
        if ($method === 'GET') {
            require_once __DIR__ . '/use_cases/CompSession.php';
            
            // Evitar cualquier salida antes de nuestra respuesta JSON
            ob_clean();
            
            // Ejecutar el caso de uso
            $useCase = new CompSession();
            $user = $useCase->execute();
            
            // Devolver la respuesta al cliente como JSON
            if ($user) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($user, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'No se pudo obtener la sesión']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }

        break;
    
    case 'login':

        require_once __DIR__ . '/use_cases/LoginUser.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['user']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            
            // Ejecutar el caso de uso
            $useCase = new LoginUser();
            $user = $useCase->execute($data['user'], $data['password']);
            
            // Si la ejecución es exitosa, el LoginUser.php ya habrá enviado la respuesta
            // No necesitamos hacer nada más aquí
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
    case 'logout':
        
        require_once __DIR__ . '/use_cases/LogoutUser.php';
        if ($method === 'GET') {
            $useCase = new LogoutUser();
            $useCase->execute();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'all':
        if ($method === 'GET') {
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $useCase = new GetAllUsers();
            $result = $useCase->execute($page, $search);
            // Ya no necesitamos json_encode porque el caso de uso ya devuelve JSON
            echo $result;
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'get':
        if ($method === 'GET') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new GetUserById();
            $user = $useCase->execute($id);
            if ($user) {
                echo json_encode($user, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'update':
        require_once __DIR__ . '/use_cases/UpdateUser.php';
        
        if ($method === 'POST') {
            // Comprobar si es una solicitud multipart/form-data o JSON
            $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
            
            // Inicializar array de datos
            $data = [];
            
            // Si es multipart/form-data (contiene archivos)
            if (strpos($contentType, 'multipart/form-data') !== false) {
                // Obtener datos del formulario POST
                $data = $_POST;
                
                // Si no hay datos en POST, devolver error
                if (empty($data)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'No se recibieron datos del formulario']);
                    exit;
                }
            } else {
                // Si es JSON normal
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Datos inválidos']);
                    exit;
                }
            }
            
            // Ejecutar el caso de uso
            $useCase = new UpdateUser();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'delete':
        if ($method === 'DELETE' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new DeleteUser();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'testConnection':
        require_once __DIR__ . '/../config/database.php';
        if ($method === 'GET') {
            $db = new DB();
            $conn = $db->getConn();
            
            if ($conn->connect_error) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Error de conexión: ' . $conn->connect_error
                ]);
                exit;
            }
            
            // Obtener información del servidor y la base de datos
            $serverInfo = $conn->server_info;
            $dbName = $conn->query("SELECT DATABASE()")
                ->fetch_row()[0];
            $charsetQuery = $conn->query("SHOW VARIABLES LIKE 'character_set_database'")
                ->fetch_assoc();
            $charset = $charsetQuery['Value'];
            
            // Obtener lista de tablas
            $tablesResult = $conn->query("SHOW TABLES");
            $tables = [];
            while ($row = $tablesResult->fetch_row()) {
                $tables[] = $row[0];
            }
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Conexión exitosa a la base de datos',
                'database_info' => [
                    'server' => $serverInfo,
                    'version' => $conn->server_version,
                    'database' => $dbName,
                    'charset' => $charset,
                    'tables' => $tables
                ]
            ]);
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
