-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2025 a las 13:57:43
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `compodev`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios_usuarios`
--

CREATE TABLE `comentarios_usuarios` (
  `id` int(11) NOT NULL,
  `texto` varchar(200) NOT NULL,
  `id_mensaje` int(20) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `recurso` varchar(50) NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `comentarios_usuarios`
--

INSERT INTO `comentarios_usuarios` (`id`, `texto`, `id_mensaje`, `fecha`, `recurso`, `id_usuario`) VALUES
(6, 'asdfasdfasdf', 1, '2025-06-06', '', 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_usuarios`
--

CREATE TABLE `mensajes_usuarios` (
  `id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `fecha` date DEFAULT current_timestamp(),
  `recurso` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `mensajes_usuarios`
--

INSERT INTO `mensajes_usuarios` (`id`, `texto`, `id_usuario`, `fecha`, `recurso`) VALUES
(1, 'asdf', 11, '2025-06-06', ''),
(2, 'asdfasdfasdf', 11, '2025-06-06', ''),
(3, 'sdasdf', 11, '2025-06-06', ''),
(4, 'asdf', 11, '2025-06-06', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(30) NOT NULL,
  `html` longtext DEFAULT NULL,
  `css` longtext DEFAULT NULL,
  `js` longtext DEFAULT NULL,
  `descripcion_proyecto` varchar(500) NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `fecha_subido` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `titulo`, `html`, `css`, `js`, `descripcion_proyecto`, `categoria`, `fecha_subido`, `id_usuario`) VALUES
(21, 'asdfasdfas', '', '', '', 'dfasdfas', 'dfasdf', '2025-06-05 09:38:36', 9),
(22, 'asdfasdfas', '', '', '', 'dfasdf', 'asdfasdf', '2025-06-05 09:39:41', 9),
(23, 'rtyurtyur', '', '', '', 'tyurtyu', 'rtyurtyu', '2025-06-05 15:00:22', 9),
(24, 'erytertyertye', '<!-- Escribe tu HTML aquí -->\n<div class=\"container\">\n  <h1>Hello CompoDev!</h1>\n  <p>Edita este HTML y verás los cambios en tiempo real</p>\n</div>', '/* Escribe tu CSS aquí */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n  padding: 20px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}', '// Escribe tu JavaScript aquí\n\nconsole.log(\"CompoDev JavaScript cargado\");\n\n// Ejemplo de código JavaScript\nfunction cambiarColor() {\n  const h1 = document.querySelector(\"h1\");\n  h1.style.color = getRandomColor();\n}\n\nfunction getRandomColor() {\n  return \"#\" + Math.floor(Math.random()*16777215).toString(16);\n}', 'rtyertyerty', 'ertyerty', '2025-06-05 15:05:21', 9),
(25, '78907890', '', '', '', '7890', '7890', '2025-06-05 16:36:56', 11),
(26, 'rutkgg', '', '', '', 'hjkghjkg', 'hjkghjk', '2025-06-05 16:51:06', 11),
(27, 'gsdghjdfgjdfg', '', '', '', 'jdfgjdfgjd', 'fgjdfgj', '2025-06-05 16:51:55', 11),
(28, 'retyjr5657567', '', '', '', 'j5ryhrjt546', '7jrthjr7j', '2025-06-05 16:51:59', 11),
(29, 'jtyjrtyjrt', '', '', '', 'yjrtyjrty', 'j456jj', '2025-06-05 16:52:04', 11),
(30, 'rtyjrtyjrty', '', '', '', 'jrtyjrtyjrty', 'jrtyjrtyj', '2025-06-05 16:52:16', 11),
(31, 'rtyjrtyj4356jergje', '', '', '', 'swfdgsh', 'wtherh', '2025-06-05 16:52:21', 11),
(32, 'asdfasdf', '', '', '', 'asdfasdf', 'asdfasdf', '2025-06-06 08:20:42', 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguidres_usuarios`
--

CREATE TABLE `seguidres_usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usu1` bigint(11) UNSIGNED NOT NULL,
  `id_usu2` bigint(11) UNSIGNED NOT NULL,
  `tiempo` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `urlFoto` varchar(50) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `verificado` int(11) DEFAULT 0,
  `fecha_registro` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `user`, `email`, `password`, `urlFoto`, `descripcion`, `verificado`, `fecha_registro`) VALUES
(9, 'alejandro', 'alejandroo.agch@gmail.com', '$2y$10$l2Z0twRNOqo7M7QGhsodOOFrs2wx3qcJz6EzpymHF.S7knFlp/j6S', 'https://via.placeholder.com/150', 'Sin descripción', 0, '2025-06-06'),
(11, 'agch', 'a@a.com', '$2y$10$l2Z0twRNOqo7M7QGhsodOOFrs2wx3qcJz6EzpymHF.S7knFlp/j6S', 'uploads/agch_1749141401.png', 'Hola, esto es una descripcion 777', 0, '2025-06-06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios_usuarios`
--
ALTER TABLE `comentarios_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_com_mes` (`id_mensaje`),
  ADD KEY `fk_com_usu` (`id_usuario`);

--
-- Indices de la tabla `mensajes_usuarios`
--
ALTER TABLE `mensajes_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mes_usu` (`id_usuario`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_pro_usu` (`id_usuario`);

--
-- Indices de la tabla `seguidres_usuarios`
--
ALTER TABLE `seguidres_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_usu_susu1` (`id_usu1`),
  ADD KEY `fk_usu_susu2` (`id_usu2`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios_usuarios`
--
ALTER TABLE `comentarios_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `mensajes_usuarios`
--
ALTER TABLE `mensajes_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `seguidres_usuarios`
--
ALTER TABLE `seguidres_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios_usuarios`
--
ALTER TABLE `comentarios_usuarios`
  ADD CONSTRAINT `fk_com_mes` FOREIGN KEY (`id_mensaje`) REFERENCES `mensajes_usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_com_usu` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensajes_usuarios`
--
ALTER TABLE `mensajes_usuarios`
  ADD CONSTRAINT `fk_mes_usu` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `fk_pro_usu` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `seguidres_usuarios`
--
ALTER TABLE `seguidres_usuarios`
  ADD CONSTRAINT `fk_usu_susu1` FOREIGN KEY (`id_usu1`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usu_susu2` FOREIGN KEY (`id_usu2`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
