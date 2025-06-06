<?php

class User {
    public $user;
    public $email;
    public $password;
    public $urlFoto;
    public $descripcion;
    public $fecha_registro;

    public function __construct($user, $email, $password, $urlFoto, $descripcion, $fecha_registro) {
        $this->user = $user;
        $this->email = $email;
        $this->password = $password;
        $this->urlFoto = $urlFoto;
        $this->descripcion = $descripcion;
        $this->fecha_registro = $fecha_registro;
    }
}
