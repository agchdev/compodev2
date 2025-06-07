<?php
require_once __DIR__ . '/../../config/database.php';

class VerifyUser {
    public function __construct() {
        // Constructor vacío
    }

    public function execute($userId) {
        try {
            // Crear conexión a la base de datos
            $db = new DB();
            $conn = $db->getConn();
            
            // Preparar la consulta para actualizar el estado de verificación
            $query = "UPDATE usuarios SET verificado = 1 WHERE id = ?";
            
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $userId);
            
            // Ejecutar la consulta y verificar el resultado
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Usuario verificado correctamente'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Error al actualizar estado de verificación'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Error en el servidor: ' . $e->getMessage()
            ];
        }
    }
}
?>
