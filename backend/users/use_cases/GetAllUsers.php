<?php

require_once __DIR__ . '/../../config/database.php';

class GetAllUsers {
    public function execute($page = 1, $search = '') {
        $db = new DB();
        $conn = $db->getConn();
        
        // Cambiar límite a 10 usuarios por página
        $limit = 10;
        $offset = ($page - 1) * $limit;
        
        // Contar total de registros para la paginación
        if (!empty($search)) {
            // Búsqueda por nombre de usuario o email
            $searchTerm = "%{$search}%";
            $countSql = "SELECT COUNT(*) as total FROM usuarios WHERE user LIKE ? OR email LIKE ?";
            $countStmt = $conn->prepare($countSql);
            if (!$countStmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error al preparar la consulta de conteo"]);
                return;
            }
            $countStmt->bind_param("ss", $searchTerm, $searchTerm);
            $countStmt->execute();
            $totalResult = $countStmt->get_result();
            $totalRow = $totalResult->fetch_assoc();
            $totalUsers = $totalRow['total'];
            $countStmt->close();
            
            // Consulta con búsqueda
            $sql = "SELECT id, user, email, urlFoto, descripcion FROM usuarios WHERE user LIKE ? OR email LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error al preparar la consulta"]);
                return;
            }
            $stmt->bind_param("ssii", $searchTerm, $searchTerm, $limit, $offset);
        } else {
            // Conteo sin búsqueda
            $countSql = "SELECT COUNT(*) as total FROM usuarios";
            $countResult = $conn->query($countSql);
            $totalRow = $countResult->fetch_assoc();
            $totalUsers = $totalRow['total'];
            
            // Consulta sin búsqueda
            $sql = "SELECT id, user, email, urlFoto, descripcion, rol FROM usuarios ORDER BY id DESC LIMIT ? OFFSET ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error al preparar la consulta"]);
                return;
            }
            $stmt->bind_param("ii", $limit, $offset);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $users = [];
        
        while ($row = $result->fetch_assoc()) {
            // No devolver la contraseña por seguridad
            $users[] = $row;
        }
        
        $stmt->close();
        
        // Calcular información de paginación
        $totalPages = ceil($totalUsers / $limit);
        
        $response = [
            "users" => $users,
            "pagination" => [
                "total" => $totalUsers,
                "totalPages" => $totalPages,
                "currentPage" => $page,
                "perPage" => $limit
            ]
        ];
        
        return json_encode($response);
    }
}
