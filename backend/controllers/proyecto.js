var fs = require('../index'); //LLAMADO A FIRESTORE
var FileSystem = require('fs'); //para Post imágenes y Get de imágenes
var path = require('path'); //para Cargar rutas físicas






var controller = {

    // Función de prueba Home '/'
    home: function(req, res) {
        return res.status(200).send({
            message: 'soy inicio'
        });
    },

    // Función de prueba '/test'
    test: function(req, res) {
        return res.status(200).send({
            message: 'metodo de accion del controlador'
        });
    },


    // GUARDAR EN FIRESTORE
    savefs: function(req, res) {

        var params = req.body; //recoge los valores del body
        // Modelado para recibir info del body
        var nombre = params.nombre;
        var descripcion = params.descripcion;
        var categoria = params.categoria;
        var fecha = params.fecha;
        var herramientas = params.herramientas;

        // Envío de datos a documentos con ID igual al nombre (recomendable para hacer llamados específicos)
        fs.collection('proyectos').doc(nombre).set({
                nombre: nombre,
                descripcion: descripcion,
                categoria: categoria,
                fecha: fecha,
                herramientas: herramientas,
            })
            .then(() => { //mensaje de confirmación
                return res.status(200).send({
                    message: 'guardado en firebase satisfactoriamente'
                });
            })
            .catch((error) => { //mensaje de error
                return res.status(200).send({
                    message: 'no se pudo guardar' + error

                });
            });
    },

    // MÉTODO PARA SUBIR IMÁGENES
    imagen: (req, res) => {
        var proyectoId = req.params.id; //recoge el id de la imagen a subir
        var noImagen = "no se ha subido imagen";

        //REVISAR SI EXISTE ARCHIVO EN EL BODY
        if (req.files) { //es necesario cargar la librería 'fs' (FileSyistem)

            // GUARDAR SÓLO EL NOMBRE DEL ARCHIVO
            var filePath = req.files.imagen.path; //recoge la ruta de la imagen 
            var fileSplit = filePath.split('\\'); //separar la ruta y el nombre del archivo
            var fileName = fileSplit[1]; //selecionar sólo nombre del archivo
            // PARA COMPROBAR LA EXTENCIÓN DEL ARCHIVO
            var extSplit = fileName.split('.'); //separar nombre de archivo y extención de archivo
            var fileExt = extSplit[1]; //seleccionar sólo extención de archivo

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'JPEG') { //Comprueba las extenciónes que se deseen comprobar

                fs.collection('proyectos').doc(proyectoId).update({ //usar el método UPDATE para no asobronar los datos del documento ya creado
                        imagen: fileName
                    })
                    .then(() => {
                        return res.send('se subió el archivo');
                    })
                    .catch(() => {
                        return res.send('no se subión la foto a la bd');
                    });

                // return res.status(200).send({ file: fileName });
            } else {
                // PARA BORRAR EL ARCHIVO QUE SE SUBIÓ POR ERROR DE EXTENCIÓN
                // necesario importar librería FileSystem de nodeJS
                FileSystem.unlink(filePath, (err) => {
                    return res.status(200).send({ message: 'la extención no es válida' })
                });
            }
        } else {
            return res.send(noImagen);

        }
    },


    // MÉTODO PARA RECOGER TODOS LOS DATOS DE UNA COLECCIÓN
    getProyectos: (req, res) => {

        fs.collection('proyectos').get()
            .then((snapshot) => {
                var proyectos = []; //CREAR UNA VARIABLE A EXPORTAR
                snapshot.forEach((doc) => {
                    proyectos.push(doc.data()); //INGRESAR TODOS LOS DOCUMENTOS EN LA VARIABLE A EXPORTAR
                });
                return res.send(proyectos); //EXPORTAR PROYECTOS
            })
            .catch((err) => {
                console.log('Error al tomar los documentos', err);
                return res.status(200).send({
                    message: 'no se pudo guardar' + error
                });
            });
    },


    // MÉTODO PARA HACER LLAMADO DE IMÁGENES
    getImagen: (req, res) => {


        var file = req.params.imagen; //Toma de la ruta la imagen llamada
        var pathImagen = './uploads/' + file; //Recoger del storage la imagen llamada

        // Comprobar que existe la imagen llamada
        // Es necesario la LIBRERÍA FS de NODEJS
        FileSystem.exists(pathImagen, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathImagen));
            } else {
                return res.send('imagen no cargada');
            }
        })

    },


    // MÉTODO PARA HACER LLAMADO DE UN SÓLO DOCUMENTO
    seleccionar: (req, res) => {
        var id = req.params.id; //Recoger el id del documento solicitado
        if (id == null) return res.status(404).send({ message: 'no hay id' }); //declaración de que haga falta el ID 

        fs.collection('proyectos').doc(id).get() //hace el llamdado del documento específico con el ID
            .then(doc => {
                if (!doc.exists) { //Si no existe documento, avisar
                    console.log('No such document!');
                    return res.status(404).send({ message: 'el documento no existe' });
                } else { //exportar la data del documento solicitado
                    console.log('Document data:', doc.data());
                    return res.send(doc.data());
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    },



    // BORRAR DOCUMENTO
    delete: (req, res) => {
        var id = req.params.id; //Recoge de la ruta el ID del documento a borrar
        if (id == null) return res.status(404).send({ message: 'no hay id' });

        fs.collection('proyectos').doc(id).delete(); //método de FIRESTORE para borrar
        return res.send({ message: 'se borró' });

    }
};

module.exports = controller;