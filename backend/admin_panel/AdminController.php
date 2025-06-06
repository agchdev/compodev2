<?php

/**
 * Controlador para gestionar operaciones relacionadas con el panel de administración
 * 
 * Este controlador utiliza el parámetro 'action' en la URL para determinar qué acción ejecutar.
 * Ejemplo: AdminController.php?action=projectStats
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/use_cases/GetProjectsStats.php';
require_once __DIR__ . '/use_cases/GetMessagesStats.php';
require_once __DIR__ . '/use_cases/GetUsersStats.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Configuración de CORS para desarrollo
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
    case 'projectStats':
        if ($method === 'GET') {
            $useCase = new GetProjectsStats();
            $useCase->execute();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'messageStats':
        if ($method === 'GET') {
            $useCase = new GetMessagesStats();
            $useCase->execute();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    case 'userStats':
        if ($method === 'GET') {
            $useCase = new GetUsersStats();
            $useCase->execute();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
        }
        break;

    // En caso de querer obtener todas las estadísticas en una sola llamada
    case 'dashboardStats':
        if ($method === 'GET') {
            try {
                // Obtener estadísticas de proyectos
                ob_start();
                $projectsUseCase = new GetProjectsStats();
                $projectsUseCase->execute();
                $projectsStats = json_decode(ob_get_clean(), true);

                // Obtener estadísticas de mensajes
                ob_start();
                $messagesUseCase = new GetMessagesStats();
                $messagesUseCase->execute();
                $messagesStats = json_decode(ob_get_clean(), true);

                // Obtener estadísticas de usuarios
                ob_start();
                $usersUseCase = new GetUsersStats();
                $usersUseCase->execute();
                $usersStats = json_decode(ob_get_clean(), true);

                // Combinar todas las estadísticas
                $dashboardStats = [
                    'projects' => $projectsStats,
                    'messages' => $messagesStats,
                    'users' => $usersStats
                ];

                header('Content-Type: application/json');
                echo json_encode($dashboardStats);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Error al obtener estadísticas del dashboard: ' . $e->getMessage()]);
            }
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
