<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../entities/MessagesUser.php';

/**
 * Caso de uso para obtener todos los mensajes de usuarios
 */
class GetAllMessagesUser {
    /**
     * Ejecuta el caso de uso para obtener todos los mensajes
     * @param int $page Número de página para paginación
     * @param string|null $search Término de búsqueda opcional
     * @param int $itemsPerPage Número de elementos por página
     * @return array Resultado con los mensajes y metadatos de paginación
     */
    public function execute($page = 1, $search = null, $itemsPerPage = 10) {
        try {
            // Registrar los parámetros recibidos para depuración
            error_log("GetAllMessagesUser: ejecutando con página=$page, búsqueda=$search, itemsPerPage=$itemsPerPage");
            // Crear una instancia de la conexión a la BD
            $db = new DB();
            $conn = $db->getConn();
            
            // Calcular el offset para la paginación
            $offset = ($page - 1) * $itemsPerPage;
            
            // Preparar la consulta SQL base con JOIN para obtener datos del usuario
            // Usar alias de tabla para todas las columnas para evitar ambigüedad
            error_log("Preparando consulta SQL");
            $sql = "SELECT m.id, m.texto, m.id_usuario, m.fecha, m.recurso, u.id as user_id, u.username, u.avatar, u.email, u.descripcion 
                    FROM mensajes_usuarios m 
                    LEFT JOIN usuarios u ON m.id_usuario = u.id";
            $countSql = "SELECT COUNT(*) as total FROM mensajes_usuarios";
            
            $params = [];
            $types = "";
            
            // Si hay término de búsqueda, añadir cláusula WHERE
            if ($search) {
                $sql .= " WHERE m.texto LIKE ? OR m.recurso LIKE ?";
                $countSql .= " WHERE texto LIKE ? OR recurso LIKE ?";
                $searchParam = "%{$search}%";
                $params = [$searchParam, $searchParam];
                $types = "ss";
            }
            
            // Añadir ordenamiento y límites para paginación
            $sql .= " ORDER BY m.fecha DESC LIMIT ?, ?";
            $params[] = $offset;
            $params[] = $itemsPerPage;
            $types .= "ii";
            
            // Preparar y ejecutar la consulta para obtener el total
            $countStmt = $conn->prepare($countSql);
            
            if (!empty($params) && $search) { // Solo si hay paramétros de búsqueda
                $countTypes = substr($types, 0, -2); // Quitar los dos 'i' de paginación
                $countParams = array_slice($params, 0, -2); // Quitar los parámetros de paginación
                $countStmt->bind_param($countTypes, ...$countParams);
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
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }
            
            // Cerrar la conexión
            $stmt->close();
            $conn->close();
            
            // Calcular metadatos de paginación
            $totalPages = ceil($total / $itemsPerPage);
            
            // Devolver resultado
            return [
                'data' => $messages,
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
