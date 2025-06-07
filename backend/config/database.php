<?php
class DB {
    private $conn;

    public function __construct() {
        // require_once('../../../cred.php');

        $this->conn = new mysqli("localhost", "root", "", "compodev");

        // Manejo de errores en la conexión
        if ($this->conn->connect_error) {
            throw new Exception("Error de conexión: " . $this->conn->connect_error);
        }
        
        // No imprimir mensajes de conexión exitosa automáticamente
    }

    // Método para obtener la conexión mysqli
    public function getConn() {
        return $this->conn;
    }

    // Método para probar la conexión correctamente
    public function testConnection() {
        if ($this->conn->connect_error) {
            return ["status" => "error", "message" => "Error de conexión: " . $this->conn->connect_error];
        }
        return ["status" => "success", "message" => "Conexión a la base de datos establecida."];
    }
}

// Prueba de conexión (solo si se accede directamente a este archivo)
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $db = new DB();
    // echo json_encode($db->testConnection(), JSON_UNESCAPED_UNICODE);
}

