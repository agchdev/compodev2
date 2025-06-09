<?php

class ActivityUsers {
    public $id;
    public $id_usuario;
    public $accion;
    public $fecha;
    public $id_referencia;

    public function __construct($id_usuario, $accion, $fecha, $id_referencia = null) {
        $this->id_usuario = $id_usuario;
        $this->accion = $accion;
        $this->fecha = $fecha;
        $this->id_referencia = $id_referencia;
    }
}
