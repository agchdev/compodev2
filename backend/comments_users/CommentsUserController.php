<?php

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Controlador para gestionar operaciones relacionadas con los comentarios de usuarios
 * 
 * Este controlador utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Ejemplo: CommentsUserController.php?action=create
 */


require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/CreateCommentsUser.php';
require_once __DIR__ . '/use_cases/GetAllCommentsUser.php';
require_once __DIR__ . '/use_cases/GetCommentsUserById.php';
require_once __DIR__ . '/use_cases/UpdateCommentsUser.php';
require_once __DIR__ . '/use_cases/DeleteCommentsUser.php';
require_once __DIR__ . '/use_cases/GetCommentsByMessage.php';
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
            if (!isset($data['texto']) || !isset($data['id_mensaje']) || !isset($data['id_usuario']) || !isset($data['recurso'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan campos requeridos (texto, id_mensaje, id_usuario, recurso)']);
                exit;
            }

            // Si no se proporciona fecha, se usa la fecha actual
            if (!isset($data['fecha'])) {
                $data['fecha'] = date('Y-m-d H:i:s');
            }

            // Crear un nuevo comentario
            $useCase = new CreateCommentsUser();
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
            
            // Obtener todos los comentarios
            $useCase = new GetAllCommentsUser();
            $result = $useCase->execute($page, $search, $itemsPerPage);
            
            // Asegurarse de que no haya salida antes de enviar el JSON
            if (ob_get_length()) ob_clean();
            
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
            // Verificar que se haya proporcionado un ID
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del comentario']);
                exit;
            }
            
            // Obtener el ID y obtener el comentario
            $id = intval($_GET['id']);
            $useCase = new GetCommentsUserById();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'byMessage':
        if ($method === 'GET') {
            // Verificar que se haya proporcionado un ID de mensaje
            if (!isset($_GET['id_mensaje'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del mensaje']);
                exit;
            }
            
            // Obtener parámetros de paginación
            $messageId = intval($_GET['id_mensaje']);
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $itemsPerPage = isset($_GET['itemsPerPage']) ? intval($_GET['itemsPerPage']) : 10;
            
            // Obtener comentarios del mensaje especificado
            $useCase = new GetCommentsByMessage();
            $useCase->execute($messageId, $page, $itemsPerPage);
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
                echo json_encode(['error' => 'Falta el ID del comentario']);
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
            
            // Actualizar el comentario
            $useCase = new UpdateCommentsUser();
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
                echo json_encode(['error' => 'Falta el ID del comentario']);
                exit;
            }
            
            // Obtener el ID y eliminar el comentario
            $id = intval($_GET['id']);
            $useCase = new DeleteCommentsUser();
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