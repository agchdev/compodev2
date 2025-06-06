<?php

class Project {
    public $id;
    public $titulo;
    public $html;
    public $css;
    public $js;
    public $descripcion_proyecto;
    public $categoria;
    public $id_usuario;

    public function __construct($titulo, $html, $css, $js, $descripcion_proyecto, $categoria, $id_usuario) {
        $this->id = null; // La ID se asignará después de la inserción en la base de datos
        $this->titulo = $titulo;
        $this->html = $html;
        $this->css = $css;
        $this->js = $js;
        $this->descripcion_proyecto = $descripcion_proyecto;
        $this->categoria = $categoria;
        $this->id_usuario = $id_usuario;
    }
}
?>