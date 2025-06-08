<?php

/**
 * Caso de uso para obtener los usuarios principales
 * Devuelve una lista de usuarios con información básica
 */

require_once __DIR__ . '/../../config/database.php';

class GetTopUsers {
    public function execute($limit = 8) {
        // Validar y sanitizar el límite
        $limit = intval($limit);
        if ($limit <= 0) {
            $limit = 8; // Valor predeterminado si el límite es inválido
        }
        
        // Establecer conexión
        $db = new DB();
        $conn = $db->getConn();
        
        // Consulta para obtener usuarios con cantidad de proyectos
        $sql = "SELECT u.id, u.email, COUNT(p.id) as proyectos 
                FROM users u 
                LEFT JOIN projects p ON u.id = p.id_usuario 
                WHERE u.verified = 1 
                GROUP BY u.id 
                ORDER BY proyectos DESC, u.id 
                LIMIT ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $limit);
        
        try {
            $stmt->execute();
            $result = $stmt->get_result();
            
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = [
                    'id' => $row['id'],
                    'email' => $row['email'],
                    'proyectos' => $row['proyectos']
                ];
            }
            
            // Devolver respuesta
            echo json_encode([
                'success' => true,
                'users' => $users
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Error al obtener los usuarios: ' . $e->getMessage()
            ]);
        } finally {
            $stmt->close();
            $conn->close();
        }
    }
}
