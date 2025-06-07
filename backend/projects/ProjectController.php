<?php

/**
 * Controlador para gestionar operaciones relacionadas con proyectos
 * 
 * Este controlador utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Ejemplo: ProjectController.php?action=create
 * Este enfoque simplifica las rutas y evita problemas de CORS y configuración del servidor.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/CreateProject.php';
require_once __DIR__ . '/use_cases/GetAllProjects.php';
require_once __DIR__ . '/use_cases/GetProjectById.php';
require_once __DIR__ . '/use_cases/GetProjectByIdUser.php';
require_once __DIR__ . '/use_cases/UpdateCodeProject.php';
require_once __DIR__ . '/use_cases/CheckOwner.php';
require_once __DIR__ . '/use_cases/UpdateProject.php';
require_once __DIR__ . '/use_cases/DeleteProject.php';

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
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }

            if (!isset($data['titulo']) || !isset($data['descripcion_proyecto']) || !isset($data['categoria'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan campos requeridos (titulo, descripcion_proyecto, categoria)']);
                exit;
            }

            if (!isset($data['fecha_subido'])) {
                $data['fecha_subido'] = date('Y-m-d H:i:s');
            }

            $useCase = new CreateProject();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'all':
        if ($method === 'GET') {
            // Obtener parámetros de paginación y búsqueda
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $search = isset($_GET['search']) ? $_GET['search'] : null;
            $itemsPerPage = isset($_GET['itemsPerPage']) ? intval($_GET['itemsPerPage']) : 10;
            
            $useCase = new GetAllProjects();
            $result = $useCase->execute($page, $search, $itemsPerPage);
            
            // Asegurarse de que no haya salida antes de enviar el JSON
            if (ob_get_length()) ob_clean();
            
            // Establecer las cabeceras correctas
            header('Content-Type: application/json; charset=utf-8');
            
            // Si hay error, enviar código de error
            if (isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['error' => $result['error']], JSON_UNESCAPED_UNICODE);
            } else {
                // Enviar los datos como JSON
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'get':
        if ($method === 'GET') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new GetProjectById();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'checkOwner':
        if ($method === 'GET') {
            if (!isset($_GET['id']) || !isset($_GET['id_usuario'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto o el ID del usuario']);
                exit;
            }
            $id = intval($_GET['id']);
            $id_usuario = intval($_GET['id_usuario']);
            $useCase = new CheckOwner();
            $useCase->execute($id, $id_usuario);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
    case 'getByIdUser':
        if ($method === 'GET') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new GetProjectByIdUser();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
    case 'update':
        if ($method === 'PUT' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new UpdateProject();
            $useCase->execute($id, $data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
    case 'updateCode':
        if ($method === 'PUT' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new UpdateCodeProject();
            $useCase->execute($id, $data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'delete':
        if ($method === 'DELETE' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new DeleteProject();
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