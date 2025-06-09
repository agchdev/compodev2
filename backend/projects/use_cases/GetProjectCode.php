<?php
require_once __DIR__ . '/../../config/database.php';

/**
 * Caso de uso para obtener el código (HTML, CSS, JS) de un proyecto específico
 */
class GetProjectCode {
    /**
     * Ejecuta el caso de uso
     * 
     * @param int $id ID del proyecto
     * @return void
     */
    public function execute($id) {
        try {
            $db = new DB();
            $conn = $db->getConn();
            
            $stmt = $conn->prepare("SELECT html, css, js FROM proyectos WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta");
            }
            
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $projectCode = $result->fetch_assoc();
                $stmt->close();
                
                if ($projectCode) {
                    http_response_code(200);
                    echo json_encode($projectCode, JSON_UNESCAPED_UNICODE);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Proyecto no encontrado"]);
                }
            } else {
                $stmt->close();
                throw new Exception("Error al obtener el código del proyecto");
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener el código del proyecto: " . $e->getMessage()]);
        }
    }
}
