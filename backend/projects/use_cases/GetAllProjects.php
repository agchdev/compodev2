<?php

require_once __DIR__ . '/../../config/database.php';

class GetAllProjects {
    public function execute($page = 1, $search = null, $itemsPerPage = 10) {
        $db = new DB();
        $conn = $db->getConn();
        
        // Calcular offset para paginación
        $offset = ($page - 1) * $itemsPerPage;
        
        // Preparar consulta base
        $baseQuery = "FROM proyectos";
        $countQuery = "SELECT COUNT(*) as total ";
        $dataQuery = "SELECT * ";
        $params = [];
        $types = "";
        
        // Añadir condiciones de búsqueda si se proporciona un término
        if ($search) {
            $searchTerm = "%$search%";
            $baseQuery .= " WHERE titulo LIKE ? OR categoria LIKE ?";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "ss";
        }
        
        // Consulta para obtener el recuento total
        $countSql = $countQuery . $baseQuery;
        $stmt = $conn->prepare($countSql);
        
        if (!$stmt) {
            http_response_code(500);
            return ["error" => "Error al preparar la consulta de recuento"];
        }
        
        // Bind parameters for search if they exist
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $totalResult = $stmt->get_result();
        $totalRow = $totalResult->fetch_assoc();
        $total = $totalRow['total'];
        $stmt->close();
        
        // Consulta para obtener los proyectos con paginación
        $dataSql = $dataQuery . $baseQuery . " ORDER BY fecha_subido DESC LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($dataSql);
        
        if (!$stmt) {
            http_response_code(500);
            return ["error" => "Error al preparar la consulta de datos"];
        }
        
        // Add pagination parameters
        $params[] = $itemsPerPage;
        $params[] = $offset;
        $types .= "ii";
        
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
        $stmt->close();
        
        // Devolver proyectos y metadata de paginación
        return [
            "projects" => $projects,
            "pagination" => [
                "total" => (int)$total,
                "page" => (int)$page,
                "itemsPerPage" => (int)$itemsPerPage,
                "totalPages" => ceil($total / $itemsPerPage)
            ]
        ];
    }
}
