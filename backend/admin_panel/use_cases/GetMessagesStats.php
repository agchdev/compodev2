<?php

/**
 * Caso de uso para obtener estadísticas de mensajes por períodos de tiempo
 * Devuelve la cantidad de mensajes creados en las últimas 24 horas, semana, mes y año
 */
class GetMessagesStats {
    private $conn;

    public function __construct() {
        $db = new DB();
        $this->conn = $db->getConn();
    }

    public function execute() {
        try {
            $stats = [
                'last_24h' => $this->getMessagesCountLast24Hours(),
                'last_week' => $this->getMessagesCountLastWeek(),
                'last_month' => $this->getMessagesCountLastMonth(),
                'last_year' => $this->getMessagesCountLastYear()
            ];

            header('Content-Type: application/json');
            echo json_encode($stats);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener estadísticas de mensajes: ' . $e->getMessage()]);
        }
    }

    private function getMessagesCountLast24Hours() {
        $query = "SELECT COUNT(*) as total FROM mensajes_usuarios WHERE fecha >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getMessagesCountLastWeek() {
        $query = "SELECT COUNT(*) as total FROM mensajes_usuarios WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getMessagesCountLastMonth() {
        $query = "SELECT COUNT(*) as total FROM mensajes_usuarios WHERE fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }

    private function getMessagesCountLastYear() {
        $query = "SELECT COUNT(*) as total FROM mensajes_usuarios WHERE fecha >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return (int)$data['total'];
    }
}
