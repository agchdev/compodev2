<?php
// Script para verificar y reparar la tabla seguidores_usuarios

require_once __DIR__ . '/config/database.php';

try {
    $db = new DB();
    $conn = $db->getConn();
    
    // Comprobar si la tabla existe
    $result = $conn->query("SHOW TABLES LIKE 'seguidores_usuarios'");
    $tableExists = $result->num_rows > 0;
    
    echo "Verificando tabla seguidores_usuarios...\n";
    
    if (!$tableExists) {
        echo "La tabla seguidores_usuarios no existe. Creando tabla...\n";
        
        // Crear la tabla
        $sql = "CREATE TABLE seguidores_usuarios (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            id_usu1 INT(11) NOT NULL,
            id_usu2 INT(11) NOT NULL,
            tiempo DATE NOT NULL DEFAULT CURRENT_DATE,
            INDEX (id_usu1),
            INDEX (id_usu2),
            UNIQUE KEY unique_follow (id_usu1, id_usu2)
        )";
        
        if ($conn->query($sql)) {
            echo "Tabla seguidores_usuarios creada exitosamente.\n";
        } else {
            echo "Error al crear la tabla: " . $conn->error . "\n";
        }
    } else {
        echo "La tabla seguidores_usuarios ya existe. Verificando estructura...\n";
        
        // Obtener estructura actual
        $result = $conn->query("DESCRIBE seguidores_usuarios");
        $columns = [];
        
        while ($row = $result->fetch_assoc()) {
            $columns[$row['Field']] = $row;
            echo "Campo encontrado: " . $row['Field'] . " - " . $row['Type'] . "\n";
        }
        
        // Verificar y añadir columnas necesarias
        $columnUpdates = [];
        
        if (!isset($columns['id'])) {
            $columnUpdates[] = "ADD COLUMN id INT(11) AUTO_INCREMENT PRIMARY KEY FIRST";
        }
        
        if (!isset($columns['id_usu1'])) {
            if (isset($columns['id_usuario'])) {
                $columnUpdates[] = "CHANGE COLUMN id_usuario id_usu1 INT(11) NOT NULL";
            } else {
                $columnUpdates[] = "ADD COLUMN id_usu1 INT(11) NOT NULL AFTER id";
            }
        }
        
        if (!isset($columns['id_usu2'])) {
            if (isset($columns['id_proyecto'])) {
                $columnUpdates[] = "CHANGE COLUMN id_proyecto id_usu2 INT(11) NOT NULL";
            } else {
                $columnUpdates[] = "ADD COLUMN id_usu2 INT(11) NOT NULL AFTER id_usu1";
            }
        }
        
        if (!isset($columns['tiempo'])) {
            $columnUpdates[] = "ADD COLUMN tiempo DATE NOT NULL DEFAULT CURRENT_DATE AFTER id_usu2";
        }
        
        // Aplicar las actualizaciones si hay alguna
        if (!empty($columnUpdates)) {
            $alterSql = "ALTER TABLE seguidores_usuarios " . implode(", ", $columnUpdates);
            
            if ($conn->query($alterSql)) {
                echo "Estructura de la tabla actualizada correctamente.\n";
            } else {
                echo "Error al actualizar la estructura: " . $conn->error . "\n";
            }
        } else {
            echo "La estructura de la tabla es correcta.\n";
        }
        
        // Verificar índices
        $result = $conn->query("SHOW INDEX FROM seguidores_usuarios");
        $indices = [];
        
        while ($row = $result->fetch_assoc()) {
            $indices[$row['Key_name']][] = $row['Column_name'];
        }
        
        // Añadir índices si faltan
        $indexUpdates = [];
        
        if (!isset($indices['id_usu1'])) {
            $indexUpdates[] = "ADD INDEX (id_usu1)";
        }
        
        if (!isset($indices['id_usu2'])) {
            $indexUpdates[] = "ADD INDEX (id_usu2)";
        }
        
        if (!isset($indices['unique_follow'])) {
            $indexUpdates[] = "ADD UNIQUE KEY unique_follow (id_usu1, id_usu2)";
        }
        
        if (!empty($indexUpdates)) {
            $alterSql = "ALTER TABLE seguidores_usuarios " . implode(", ", $indexUpdates);
            
            if ($conn->query($alterSql)) {
                echo "Índices añadidos correctamente.\n";
            } else {
                echo "Error al añadir índices: " . $conn->error . "\n";
            }
        }
    }
    
    echo "¡Configuración completada!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Redirigir al home después de 5 segundos
header("refresh:5;url=../index.php");
echo "Redireccionando al home en 5 segundos...";
?>
