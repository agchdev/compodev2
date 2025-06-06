<?php

/**
 * Caso de uso para obtener estadísticas de proyectos por períodos de tiempo
 * Devuelve la cantidad de proyectos creados en las últimas 24 horas, semana, mes y año
 */
class GetProjectsStats {
    private $conn;

    public function __construct() {
        $db = new DB();
        $this->conn = $db->getConn();
    }

    public function execute() {
        try {
            $stats = [
                'last_24h' => $this->getProjectCountLast24Hours(),
                'last_week' => $this->getProjectCountLastWeek(),
                'last_month' => $this->getProjectCountLastMonth(),
                'last_year' => $this->getProjectCountLastYear()
            ];

            header('Content-Type: application/json');
            echo json_encode($stats);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener estadísticas de proyectos: ' . $e->getMessage()]);
        }
    }

    private function getProjectCountLast24Hours() {
        $query = "SELECT COUNT(*) as total FROM proyectos WHERE fecha_subido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getProjectCountLastWeek() {
        $query = "SELECT COUNT(*) as total FROM proyectos WHERE fecha_subido >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getProjectCountLastMonth() {
        $query = "SELECT COUNT(*) as total FROM proyectos WHERE fecha_subido >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getProjectCountLastYear() {
        $query = "SELECT COUNT(*) as total FROM proyectos WHERE fecha_subido >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }
}
