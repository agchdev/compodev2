<?php

class FollowUsers {
    public $id;
    public $id_usuario;
    public $id_proyecto;

    public function __construct($id_usuario, $id_proyecto) {
        $this->id_usuario = $id_usuario;
        $this->id_proyecto = $id_proyecto;
    }
}
