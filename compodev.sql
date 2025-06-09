-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2025 a las 06:40:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `actividad_usuarios`
--

CREATE TABLE `actividad_usuarios` (
  `id` int(11) NOT NULL,
  `id_usuario` bigint(11) UNSIGNED NOT NULL,
  `accion` varchar(30) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividad_usuarios`
--

INSERT INTO `actividad_usuarios` (`id`, `id_usuario`, `accion`, `fecha`) VALUES
(1, 14, 'crear_comentario', '2025-06-09'),
(2, 11, 'crear_proyecto', '2025-06-09'),
(3, 11, 'crear_comentario', '2025-06-09'),
(4, 11, 'crear_proyecto', '2025-06-09'),
(5, 17, 'crear_proyecto', '2025-06-09'),
(6, 17, 'crear_proyecto', '2025-06-09');

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
(6, 'asdfasdfasdf', 1, '2025-06-06', '', 11),
(7, 'afsdfasdf', 5, '2025-06-07', '', 11),
(8, 'dwdwdwd', 4, '2025-06-07', '', 11),
(9, 'dwdwdwd', 4, '2025-06-07', '', 11),
(10, 'asdffffffwd', 6, '2025-06-08', '', 14),
(11, 'dwdwd', 6, '2025-06-08', '', 14),
(12, 'wdwdwdwd', 6, '2025-06-08', '', 15),
(13, 'asdfasdfasdf', 7, '2025-06-09', '', 14),
(14, 'ddddd', 7, '2025-06-09', '', 14),
(15, 'a', 7, '2025-06-09', '', 14),
(16, 'Que bien, me alegro', 11, '2025-06-09', '', 11);

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
(4, 'asdf', 11, '2025-06-06', ''),
(5, 'Que guaywd', 11, '2025-06-07', ''),
(6, 'dwdwdwd', 14, '2025-06-08', ''),
(7, 'asdfasdfasdfasdf', 14, '2025-06-09', ''),
(8, 'asdfasdf', 14, '2025-06-09', ''),
(9, 'aaaaaa', 14, '2025-06-09', ''),
(10, 'aaaaaaaaa', 11, '2025-06-09', ''),
(11, 'Hola me gusta el pescado', 11, '2025-06-09', ''),
(12, 'soy ferro', 17, '2025-06-09', '');

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
(26, 'rutkgg', '<!-- Escribe tu HTML aquí -->\n<div class=\"container\">\n  <h1>Hello CompoDev!</h1>\n  <p>Edita este HTML y verás los cambios en tiempo real</p>\n</div>', '/* Escribe tu CSS aquí */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n  padding: 20px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}', '// Escribe tu JavaScript aquí\n\nconsole.log(\"CompoDev JavaScript cargado\");\n\n// Ejemplo de código JavaScript\nfunction cambiarColor() {\n  const h1 = document.querySelector(\"h1\");\n  h1.style.color = getRandomColor();\n}\n\nfunction getRandomColor() {\n  return \"#\" + Math.floor(Math.random()*16777215).toString(16);\n}', 'hjkghjkg', 'hjkghjk', '2025-06-05 16:51:06', 11),
(28, 'retyjr5657567', '', '', '', 'j5ryhrjt546', '7jrthjr7j', '2025-06-05 16:51:59', 11),
(29, 'jtyjrtyjrt', '', '', '', 'yjrtyjrty', 'j456jj', '2025-06-05 16:52:04', 11),
(30, 'rtyjrtyjrty', '', '', '', 'jrtyjrtyjrty', 'jrtyjrtyj', '2025-06-05 16:52:16', 11),
(31, 'rtyjrtyj4356jergje', '', '', '', 'swfdgsh', 'wtherh', '2025-06-05 16:52:21', 11),
(32, 'asdfasdf', '', '', '', 'Hey', 'asdfasdf', '2025-06-06 08:20:42', 11),
(37, 'hey', '', '', '', 'asdfasdf', 'Cards', '2025-06-07 23:43:49', 11),
(38, 'qwerqwerqwer', '', '', '', 'qwerqwerqwer', 'Navegación', '2025-06-08 15:20:27', 11),
(39, 'asdfasdfasdf', '', '', '', 'asdfasdfasdf', 'Animación', '2025-06-08 23:21:48', 16),
(40, 'asdfasdf', '', '', '', 'asdfasdf', 'Animación', '2025-06-09 03:10:13', 16),
(41, 'prueba', '', '', '', 'aaaaaa', 'Animación', '2025-06-09 03:18:36', 11),
(42, 'prueba de registro', '', '', '', 'aaaa', 'Navegación', '2025-06-09 03:24:32', 11),
(43, 'ferro', '', '', '', 'hola', 'Botones', '2025-06-09 03:45:15', 11),
(44, 'fkghjkghjkghj', '', '', '', 'llllll', 'Animación', '2025-06-09 03:55:00', 17),
(45, 'gg', '<div class=\"board\">\n  <div class=\"cell\" data-index=\"0\"></div>\n  <div class=\"cell\" data-index=\"1\"></div>\n  <div class=\"cell\" data-index=\"2\"></div>\n  <div class=\"cell\" data-index=\"3\"></div>\n  <div class=\"cell\" data-index=\"4\"></div>\n  <div class=\"cell\" data-index=\"5\"></div>\n  <div class=\"cell\" data-index=\"6\"></div>\n  <div class=\"cell\" data-index=\"7\"></div>\n  <div class=\"cell\" data-index=\"8\"></div>\n</div>\n<div class=\"status\"></div>', '.board { display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px); width: 300px; height: 300px; border-collapse: collapse; margin: 50px auto; }\n.cell { width: 100px; height: 100px; border: 2px solid black; display: flex; justify-content: center; align-items: center; font-size: 60px; cursor: pointer; }\n.cell:hover { background-color: #f0f0f0; }\n.status { text-align: center; font-size: 20px; margin-top: 20px; }', 'const board = document.querySelector(\'.board\');\nconst cells = document.querySelectorAll(\'.cell\');\nconst status = document.querySelector(\'.status\');\nlet currentPlayer = \'X\';\nlet gameBoard = [\'\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', \'\'];\nlet gameActive = true;\nconst winningConditions = [\n  [0, 1, 2], [3, 4, 5], [6, 7, 8],\n  [0, 3, 6], [1, 4, 7], [2, 5, 8],\n  [0, 4, 8], [2, 4, 6]\n];\nconst handleCellClick = (e) => {\n  const clickedCell = e.target;\n  const index = parseInt(clickedCell.dataset.index);\n  if (gameBoard[index] !== \'\' || !gameActive) {\n    return;\n  }\n  gameBoard[index] = currentPlayer;\n  clickedCell.textContent = currentPlayer;\n  handleResultValidation();\n};\nconst handleResultValidation = () => {\n  let roundWon = false;\n  for (let i = 0; i <= 7; i++) {\n    const winCondition = winningConditions[i];\n    let a = gameBoard[winCondition[0]];\n    let b = gameBoard[winCondition[1]];\n    let c = gameBoard[winCondition[2]];\n    if (a === \'\' || b === \'\' || c === \'\') {\n      continue;\n    }\n    if (a === b && b === c) {\n      roundWon = true;\n      break;\n    }\n  }\n  if (roundWon) {\n    status.textContent = `${currentPlayer} wins!`;\n    gameActive = false;\n    return;\n  }\n  let roundDraw = !gameBoard.includes(\'\');\n  if (roundDraw) {\n    status.textContent = \'Game ended in a draw!\';\n    gameActive = false;\n    return;\n  }\n  currentPlayer = currentPlayer === \'X\' ? \'O\' : \'X\';\n  status.textContent = `${currentPlayer}\'s turn`;\n};\ncells.forEach(cell => cell.addEventListener(\'click\', handleCellClick));', 'gg', 'Animación', '2025-06-09 04:16:06', 17);

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

--
-- Volcado de datos para la tabla `seguidres_usuarios`
--

INSERT INTO `seguidres_usuarios` (`id`, `id_usu1`, `id_usu2`, `tiempo`) VALUES
(1, 11, 16, '2025-06-09'),
(2, 16, 15, '2025-06-09'),
(3, 16, 14, '2025-06-09'),
(4, 16, 13, '2025-06-09'),
(5, 16, 12, '2025-06-09'),
(6, 16, 11, '2025-06-09'),
(7, 16, 9, '2025-06-09'),
(8, 17, 16, '2025-06-09'),
(9, 17, 15, '2025-06-09'),
(10, 17, 14, '2025-06-09'),
(11, 17, 13, '2025-06-09'),
(12, 17, 12, '2025-06-09'),
(13, 17, 11, '2025-06-09'),
(14, 17, 9, '2025-06-09');

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
  `fecha_registro` date NOT NULL DEFAULT current_timestamp(),
  `rol` varchar(14) NOT NULL DEFAULT 'desarrollador'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `user`, `email`, `password`, `urlFoto`, `descripcion`, `verificado`, `fecha_registro`, `rol`) VALUES
(9, 'alejandro', 'alejandroo.agch@gmail.com', '$2y$10$l2Z0twRNOqo7M7QGhsodOOFrs2wx3qcJz6EzpymHF.S7knFlp/j6S', 'https://via.placeholder.com/150', 'Sin descripción', 0, '2025-06-06', 'desarrollador'),
(11, 'agch', 'a@a.com', '$2y$10$l2Z0twRNOqo7M7QGhsodOOFrs2wx3qcJz6EzpymHF.S7knFlp/j6S', 'uploads/agch_1749325748.jpg', 'Hola, esto es una descripcion 777 ', 1, '2025-06-06', 'desarrollador'),
(12, 'erica', 'erica@erica.com', '$2y$10$Av7eJcaBdAfxt33Y9ERp4.wwmRbZdRe155DqwT7hZNkefPJMxNDnC', 'uploads/erica_1749307237.jpg', 'asdfasdf', 0, '2025-06-07', 'desarrollador'),
(13, 'maria', 'maria@maria.com', '$2y$10$u0Yu/bBQsuipYN9YVqelre5kwKsiZQCu9Ft.8UFgdXVnkqNu/zA4y', 'uploads/maria_1749339873.webp', 'Estoy como queso, me gusta Alejandro', 1, '2025-06-08', 'desarrollador'),
(14, 'admin', 'admin@admin.com', '$2y$10$hl3Lvs3.CPnDLLpyJvA6s.oNAwhi35cyJ15FM/7sJWR5oAyy3ik0G', 'uploads/admin_1749375198.jpg', 'Soy el admin', 1, '2025-06-08', 'admin'),
(15, 'sanches', 'sanches@sanches.com', '$2y$10$yLNcV0xQmIVRwM4bilYzsOWq7RLU4R5tQs7wPZk7ghhMUgp7bi/MS', 'uploads/sanches_1749398098.jpg', 'asdf', 1, '2025-06-08', 'desarrollador'),
(16, 'pepe', 'pepe@pepe.com', '$2y$10$2c9D8oBf5sfZs0cnwqyLxuXoIl/l4h4lqtVtK3KeZtjtWSYDJkA7q', 'default.jpg', 'asdfasdf', 0, '2025-06-09', 'desarrollador'),
(17, 'ferro', 'ferro@ferro.com', '$2y$10$686I8eb6c86iRJ2pivMn.umgGV9Fp5nyQLx9OAy/l.o2.rd7QTeGm', 'uploads/ferro_1749440929.webp', 'soy ferro', 1, '2025-06-09', 'desarrollador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad_usuarios`
--
ALTER TABLE `actividad_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_act_pusu` (`id_usuario`);

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
-- AUTO_INCREMENT de la tabla `actividad_usuarios`
--
ALTER TABLE `actividad_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `comentarios_usuarios`
--
ALTER TABLE `comentarios_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `mensajes_usuarios`
--
ALTER TABLE `mensajes_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `seguidres_usuarios`
--
ALTER TABLE `seguidres_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad_usuarios`
--
ALTER TABLE `actividad_usuarios`
  ADD CONSTRAINT `fk_act_pusu` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
