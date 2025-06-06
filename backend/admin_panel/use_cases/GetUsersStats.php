<?php

/**
 * Caso de uso para obtener estadísticas de usuarios por períodos de tiempo
 * Devuelve la cantidad de usuarios creados en las últimas 24 horas, semana, mes y año
 */
class GetUsersStats {
    private $conn;

    public function __construct() {
        $db = new DB();
        $this->conn = $db->getConn();
    }

    public function execute() {
        try {
            $stats = [
                'last_24h' => $this->getUsersCountLast24Hours(),
                'last_week' => $this->getUsersCountLastWeek(),
                'last_month' => $this->getUsersCountLastMonth(),
                'last_year' => $this->getUsersCountLastYear()
            ];

            header('Content-Type: application/json');
            echo json_encode($stats);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener estadísticas de usuarios: ' . $e->getMessage()]);
        }
    }

    private function getUsersCountLast24Hours() {
        $query = "SELECT COUNT(*) as total FROM usuarios WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getUsersCountLastWeek() {
        $query = "SELECT COUNT(*) as total FROM usuarios WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getUsersCountLastMonth() {
        $query = "SELECT COUNT(*) as total FROM usuarios WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getUsersCountLastYear() {
        $query = "SELECT COUNT(*) as total FROM usuarios WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }
}
