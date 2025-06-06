<?php

require_once __DIR__ . '/use_cases/FollowUser.php';
require_once __DIR__ . '/use_cases/UnfollowUser.php';
require_once __DIR__ . '/use_cases/GetFollowedUsers.php';
require_once __DIR__ . '/use_cases/CountFollowers.php';

// Obtener ruta y método
$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

header('Access-Control-Allow-Origin: http://localhost:5173/');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ruta: /follow/create  - POST
if (strpos($requestUri, '/follow/create') !== false && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id_usuario']) || !isset($data['id_proyecto'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }
    $useCase = new FollowUser();
    $result = $useCase->execute($data['id_usuario'], $data['id_proyecto']);
    if ($result) {
        echo json_encode(['message' => 'Usuario seguido correctamente']);
    }
    exit;
}

// Ruta: /follow/delete  - DELETE
if (strpos($requestUri, '/follow/delete') !== false && $method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id_usuario']) || !isset($data['id_proyecto'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }
    $useCase = new UnfollowUser();
    $result = $useCase->execute($data['id_usuario'], $data['id_proyecto']);
    if ($result) {
        echo json_encode(['message' => 'Usuario dejado de seguir correctamente']);
    }
    exit;
}

// Ruta: /follow/followed/{id}  - GET
if (preg_match('#/follow/followed/(\d+)#', $requestUri, $matches) && $method === 'GET') {
    $id_usuario = intval($matches[1]);
    $useCase = new GetFollowedUsers();
    $users = $useCase->execute($id_usuario);
    echo json_encode($users, JSON_UNESCAPED_UNICODE);
    exit;
}

// Ruta: /follow/count/{id}  - GET
if (preg_match('#/follow/count/(\d+)#', $requestUri, $matches) && $method === 'GET') {
    $id_usuario = intval($matches[1]);
    $useCase = new CountFollowers();
    $count = $useCase->execute($id_usuario);
    echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
    exit;
}

// Ruta no encontrada
http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada']);
