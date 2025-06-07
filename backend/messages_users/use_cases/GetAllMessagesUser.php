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
        error_log("[DEBUG] GetAllMessagesUser: Inicio de ejecución");
        // Si itemsPerPage es 0 o null, obtenemos todos los mensajes sin paginación
        $usePagination = ($itemsPerPage > 0);
        error_log("[DEBUG] Paginación: " . ($usePagination ? 'Sí' : 'No') . ", itemsPerPage=$itemsPerPage, page=$page");
        try {
            // Registrar los parámetros recibidos para depuración
            error_log("GetAllMessagesUser: ejecutando con página=$page, búsqueda=$search, itemsPerPage=$itemsPerPage");
            // Crear una instancia de la conexión a la BD
            error_log("[DEBUG] Creando conexión a la base de datos");
            $db = new DB();
            $conn = $db->getConn();
            
            if ($conn->connect_error) {
                error_log("[ERROR] Error de conexión a la BD: " . $conn->connect_error);
                return ['error' => 'Error de conexión a la base de datos: ' . $conn->connect_error];
            }
            error_log("[DEBUG] Conexión a la BD establecida correctamente");
            
            // Calcular el offset para la paginación
            $offset = ($page - 1) * $itemsPerPage;
            
            // Preparar la consulta SQL base con JOIN para obtener datos del usuario
            // Usar alias de tabla para todas las columnas para evitar ambigüedad
            error_log("[DEBUG] Preparando consulta SQL");
            $sql = "SELECT m.id, m.texto, m.id_usuario, m.fecha, m.recurso, u.id as user_id, u.user as username, u.urlFoto as avatar, u.email, u.descripcion 
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
            
            // Añadir ordenamiento y límites para paginación solo si se usa paginación
            $sql .= " ORDER BY m.fecha DESC";
            if ($usePagination) {
                $sql .= " LIMIT ?, ?";
                $params[] = $offset;
                $params[] = $itemsPerPage;
                $types .= "ii";
            }
            
            error_log("[DEBUG] Consulta SQL para contador: $countSql");
            // Preparar y ejecutar la consulta para obtener el total
            $countStmt = $conn->prepare($countSql);
            if (!$countStmt) {
                error_log("[ERROR] Error en prepare del contador: " . $conn->error);
                return ['error' => 'Error preparando la consulta: ' . $conn->error];
            }
            
            if (!empty($params) && $search) { // Solo si hay paramétros de búsqueda
                $countTypes = substr($types, 0, -2); // Quitar los dos 'i' de paginación
                $countParams = array_slice($params, 0, -2); // Quitar los parámetros de paginación
                error_log("[DEBUG] Bind_param para contador con tipos: $countTypes");
                $countStmt->bind_param($countTypes, ...$countParams);
            }
            
            error_log("[DEBUG] Ejecutando consulta de contador");
            if (!$countStmt->execute()) {
                error_log("[ERROR] Error ejecutando consulta del contador: " . $countStmt->error);
                return ['error' => 'Error ejecutando la consulta del contador: ' . $countStmt->error];
            }
            
            $countResult = $countStmt->get_result();
            if (!$countResult) {
                error_log("[ERROR] Error obteniendo resultados del contador: " . $countStmt->error);
                return ['error' => 'Error obteniendo resultados del contador'];
            }
            
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow['total'];
            error_log("[DEBUG] Total de mensajes: $total");
            $countStmt->close();
            
            // Preparar y ejecutar la consulta principal
            error_log("[DEBUG] Consulta SQL principal: $sql");
            error_log("[DEBUG] Tipos de parámetros: $types");
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                error_log("[ERROR] Error en prepare de consulta principal: " . $conn->error);
                return ['error' => 'Error preparando la consulta principal: ' . $conn->error];
            }

            if (!empty($types)) {
                error_log("[DEBUG] Ejecutando bind_param con tipos: $types");
                try {
                    $stmt->bind_param($types, ...$params);
                } catch (Exception $e) {
                    error_log("[ERROR] Error en bind_param: " . $e->getMessage());
                    return ['error' => 'Error en los parámetros de la consulta: ' . $e->getMessage()];
                }
            }
            
            error_log("[DEBUG] Ejecutando consulta principal");
            if (!$stmt->execute()) {
                error_log("[ERROR] Error ejecutando consulta principal: " . $stmt->error);
                return ['error' => 'Error ejecutando la consulta principal: ' . $stmt->error];
            }
            
            $result = $stmt->get_result();
            if (!$result) {
                error_log("[ERROR] Error obteniendo resultados: " . $stmt->error);
                return ['error' => 'Error obteniendo resultados'];
            }
            
            // Procesar los resultados
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }
            
            // Cerrar la conexión
            $stmt->close();
            $conn->close();
            
            // Calcular metadatos de paginación evitando división por cero
            if ($itemsPerPage > 0) {
                $totalPages = ceil($total / $itemsPerPage);
            } else {
                // Si no hay paginación, hay una sola página con todos los datos
                $totalPages = 1;
            }
            
            error_log("[DEBUG] Datos procesados: " . count($messages) . " mensajes en $totalPages páginas");
            
            // Devolver resultado
            $result = [
                'data' => $messages,
                'pagination' => [
                    'total' => $total,
                    'totalPages' => $totalPages,
                    'currentPage' => $page,
                    'itemsPerPage' => $itemsPerPage
                ]
            ];
            
            error_log("[DEBUG] Finalizando ejecución exitosamente");
            return $result;
            
        } catch (Exception $e) {
            error_log("[ERROR] Excepción no controlada: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return ['error' => $e->getMessage()];
        }
    }
}
?>
