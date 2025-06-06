<?php

/**
 * Controlador centralizado para todas las peticiones al backend
 * 
 * Este archivo actúa como punto de entrada único para todas las peticiones al backend.
 * Utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Este enfoque simplifica las rutas y evita problemas de CORS y configuración del servidor.
 */

// Permitir cualquier origen durante el desarrollo
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // Cache preflight por 24 horas
header('Access-Control-Allow-Credentials: true'); // Permitir credenciales

// Manejar solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Para solicitudes normales, establecer el tipo de contenido JSON
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    header('Content-Type: application/json; charset=utf-8');
}

// Verificar que se haya proporcionado una acción
if (!isset($_GET['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se ha especificado ninguna acción']);
    exit;
}

$action = $_GET['action'];
$method = $_SERVER['REQUEST_METHOD'];

// Mapeo de acciones a controladores y métodos
switch ($action) {
    // Acciones de usuarios
    case 'iniciarSesion':
        require_once __DIR__ . '/../users/use_cases/LoginUser.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            
            $useCase = new LoginUser();
            $useCase->execute($data['email'], $data['password']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'registrarUsuario':
        require_once __DIR__ . '/../users/use_cases/CreateUser.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            
            // Validar que todos los campos requeridos estén presentes
            if (!isset($data['user']) || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan campos requeridos (user, email, password)']);
                exit;
            }
            
            // Establecer valores predeterminados para campos opcionales
            if (!isset($data['urlFoto'])) {
                $data['urlFoto'] = 'https://via.placeholder.com/150';
            }
            
            if (!isset($data['descripcion'])) {
                $data['descripcion'] = 'Sin descripción';
            }
            
            $useCase = new CreateUser();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerUsuarios':
        require_once __DIR__ . '/../users/use_cases/GetAllUsers.php';
        if ($method === 'GET') {
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $useCase = new GetAllUsers();
            $users = $useCase->execute($page);
            echo json_encode($users, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerUsuario':
        require_once __DIR__ . '/../users/use_cases/GetUserById.php';
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
        
    case 'actualizarUsuario':
        require_once __DIR__ . '/../users/use_cases/UpdateUser.php';
        if ($method === 'PUT' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new UpdateUser();
            $useCase->execute($id, $data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'eliminarUsuario':
        require_once __DIR__ . '/../users/use_cases/DeleteUser.php';
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
        
    // Acciones de proyectos
    case 'crearProyecto':
        require_once __DIR__ . '/../projects/use_cases/CreateProject.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new CreateProject();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerProyectos':
        require_once __DIR__ . '/../projects/use_cases/GetAllProjects.php';
        if ($method === 'GET') {
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $useCase = new GetAllProjects();
            $projects = $useCase->execute($page);
            echo json_encode($projects, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerProyecto':
        require_once __DIR__ . '/../projects/use_cases/GetProjectById.php';
        if ($method === 'GET') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new GetProjectById();
            $project = $useCase->execute($id);
            if ($project) {
                echo json_encode($project, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Proyecto no encontrado']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'actualizarProyecto':
        require_once __DIR__ . '/../projects/use_cases/UpdateProject.php';
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
        
    case 'eliminarProyecto':
        require_once __DIR__ . '/../projects/use_cases/DeleteProject.php';
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
        
    // Acciones de comentarios
    case 'crearComentario':
        require_once __DIR__ . '/../comments/use_cases/CreateComment.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new CreateComment();
            $useCase->execute($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerComentarios':
        require_once __DIR__ . '/../comments/use_cases/GetAllComments.php';
        if ($method === 'GET') {
            $projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;
            if (!$projectId) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del proyecto']);
                exit;
            }
            $useCase = new GetAllComments();
            $comments = $useCase->execute($projectId);
            echo json_encode($comments, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerComentario':
        require_once __DIR__ . '/../comments/use_cases/GetCommentById.php';
        if ($method === 'GET') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del comentario']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new GetCommentById();
            $comment = $useCase->execute($id);
            if ($comment) {
                echo json_encode($comment, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Comentario no encontrado']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'actualizarComentario':
        require_once __DIR__ . '/../comments/use_cases/UpdateComment.php';
        if ($method === 'PUT' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del comentario']);
                exit;
            }
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new UpdateComment();
            $useCase->execute($id, $data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'eliminarComentario':
        require_once __DIR__ . '/../comments/use_cases/DeleteComment.php';
        if ($method === 'DELETE' || $method === 'POST') { // Permitir POST para compatibilidad
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del comentario']);
                exit;
            }
            $id = intval($_GET['id']);
            $useCase = new DeleteComment();
            $useCase->execute($id);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    // Acciones de seguimiento de usuarios
    case 'seguirUsuario':
        require_once __DIR__ . '/../follow_users/use_cases/FollowUser.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['follower_id']) || !isset($data['followed_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new FollowUser();
            $useCase->execute($data['follower_id'], $data['followed_id']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'dejarDeSeguirUsuario':
        require_once __DIR__ . '/../follow_users/use_cases/UnfollowUser.php';
        if ($method === 'POST' || $method === 'DELETE') { // Permitir POST para compatibilidad
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['follower_id']) || !isset($data['followed_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new UnfollowUser();
            $useCase->execute($data['follower_id'], $data['followed_id']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerSeguidores':
        require_once __DIR__ . '/../follow_users/use_cases/CountFollowers.php';
        if ($method === 'GET') {
            if (!isset($_GET['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $userId = intval($_GET['user_id']);
            $useCase = new CountFollowers();
            $count = $useCase->execute($userId);
            echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerSeguidos':
        require_once __DIR__ . '/../follow_users/use_cases/GetFollowedUsers.php';
        if ($method === 'GET') {
            if (!isset($_GET['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $userId = intval($_GET['user_id']);
            $useCase = new GetFollowedUsers();
            $users = $useCase->execute($userId);
            echo json_encode($users, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    // Acciones de asignación de proyectos a usuarios
    case 'asignarProyecto':
        require_once __DIR__ . '/../projects_users/use-cases/AssignmentProject.php';
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['project_id']) || !isset($data['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new AssignmentProject();
            $useCase->execute($data['project_id'], $data['user_id']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'eliminarAsignacionProyecto':
        require_once __DIR__ . '/../projects_users/use-cases/DeleteProjects.php';
        if ($method === 'DELETE' || $method === 'POST') { // Permitir POST para compatibilidad
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['project_id']) || !isset($data['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }
            $useCase = new DeleteProjects();
            $useCase->execute($data['project_id'], $data['user_id']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'obtenerProyectosUsuario':
        require_once __DIR__ . '/../projects_users/use-cases/GetProjectsUsers.php';
        if ($method === 'GET') {
            if (!isset($_GET['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $userId = intval($_GET['user_id']);
            $useCase = new GetProjectsUsers();
            $projects = $useCase->execute($userId);
            echo json_encode($projects, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    case 'contarProyectosUsuario':
        require_once __DIR__ . '/../projects_users/use-cases/CountProjects.php';
        if ($method === 'GET') {
            if (!isset($_GET['user_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del usuario']);
                exit;
            }
            $userId = intval($_GET['user_id']);
            $useCase = new CountProjects();
            $count = $useCase->execute($userId);
            echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;
        
    // Prueba de conexión
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
            $dbName = $conn->query("SELECT DATABASE()")->fetch_row()[0];
            $charsetQuery = $conn->query("SHOW VARIABLES LIKE 'character_set_database'")->fetch_assoc();
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
