// CONFIGURACIÓN DE EXPRESS
var express = require('express');
var ControladorProyecto = require('../controllers/proyecto'); //Llama los métodos de controlador

var router = express.Router(); //define router de EXPRESS

// CONFIGURACIÓN  DE MULTIPARTY
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: './uploads' }); //Define donde serán guardados los archivos


// LISTADO DE TURAS
router.get('/', ControladorProyecto.home);
router.post('/test', ControladorProyecto.test);
router.post('/savefs', ControladorProyecto.savefs);
// PARA SUBIR IMÁGENES REQUIERE CONFIGURAR MULTIPARTY Y ASIGNARLO ANTES DEL MÉTODO
router.post('/imagen/:id?', multipartyMiddleware, ControladorProyecto.imagen);
router.get('/getImagen/:imagen', ControladorProyecto.getImagen);
router.get('/getProyectos', ControladorProyecto.getProyectos);
router.delete('/delete/:id?', ControladorProyecto.delete);
router.get('/seleccionar/:id?', ControladorProyecto.seleccionar);

module.exports = router;