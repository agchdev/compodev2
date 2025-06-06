<?php

class CommentsUser {
    public $id;
    public $texto;
    public $id_mensaje;
    public $id_usuario;
    public $fecha;
    public $recurso;

    public function __construct($texto, $id_mensaje, $id_usuario, $fecha, $recurso) {
        $this->id = null; // La ID se asignará después de la inserción en la base de datos
        $this->texto = $texto;
        $this->id_mensaje = $id_mensaje;
        $this->id_usuario = $id_usuario;
        $this->fecha = $fecha;
        $this->recurso = $recurso;
    }
}

?>