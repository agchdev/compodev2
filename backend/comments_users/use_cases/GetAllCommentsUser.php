<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/CommentsUser.php';

/**
 * Caso de uso para obtener todos los comentarios de usuarios
 */
class GetAllCommentsUser {
    /**
     * Ejecuta el caso de uso para obtener todos los comentarios
     * @param int $page Número de página para paginación
     * @param string|null $search Término de búsqueda opcional
     * @param int $itemsPerPage Número de elementos por página
     * @return array Resultado con los comentarios y metadatos de paginación
     */
    public function execute($page = 1, $search = null, $itemsPerPage = 10) {
        try {
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Calcular el offset para la paginación
            $offset = ($page - 1) * $itemsPerPage;
            
            // Preparar la consulta SQL base con JOIN a usuarios para obtener información del autor
            $sql = "SELECT c.*, u.user as username, u.email, u.urlFoto as avatar 
                   FROM comentarios_usuarios c 
                   LEFT JOIN usuarios u ON c.id_usuario = u.id";
            $countSql = "SELECT COUNT(*) as total FROM comentarios_usuarios c";
            
            $params = [];
            $types = "";
            
            // Si hay término de búsqueda, añadir cláusula WHERE
            if ($search) {
                $sql .= " WHERE texto LIKE ? OR recurso LIKE ?";
                $countSql .= " WHERE texto LIKE ? OR recurso LIKE ?";
                $searchParam = "%{$search}%";
                $params = [$searchParam, $searchParam];
                $types = "ss";
            }
            
            // Añadir ordenamiento y límites para paginación
            $sql .= " ORDER BY fecha DESC LIMIT ?, ?";
            $params[] = $offset;
            $params[] = $itemsPerPage;
            $types .= "ii";
            
            // Preparar y ejecutar la consulta para obtener el total
            $countStmt = $conn->prepare($countSql);
            if ($search) {
                $countStmt->bind_param("ss", $searchParam, $searchParam);
            }
            $countStmt->execute();
            $countResult = $countStmt->get_result();
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow['total'];
            $countStmt->close();
            
            // Preparar y ejecutar la consulta principal
            $stmt = $conn->prepare($sql);
            if (!empty($types)) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Procesar los resultados
            $comments = [];
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
            
            // Cerrar la conexión
            $stmt->close();
            $conn->close();
            
            // Calcular metadatos de paginación
            $totalPages = ceil($total / $itemsPerPage);
            
            // Devolver resultado
            return [
                'data' => $comments,
                'pagination' => [
                    'total' => $total,
                    'totalPages' => $totalPages,
                    'currentPage' => $page,
                    'itemsPerPage' => $itemsPerPage
                ]
            ];
            
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
?>
