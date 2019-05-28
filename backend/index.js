'use-stric';

// CONFIGURACIÓN DE EXPRESS
const express = require('express');
const app = express();
var port = 3500;
app.listen(port, () => {
    console.log('Se escucha el puerto http://localhost:3500'); //o el puerto que se desee elegir
});

// BODY PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CONEXIÓN A FIREBASE
var admin = require('firebase-admin');
//cargar la llave privada de FIREBASE descargada y adjuntada a la carpeta raíz del backend
var serviceAccount = require('./<archivo>.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<proyecto-de-firebase.firebaseio.com"
});
var db = admin.database(); //variable para usar Firebase Database
var fs = admin.firestore(); //variable para usar Firebase Firestore
// module.exports = db;
module.exports = fs;


// LLAMADO DE LAS RUTAS
var rutas = require('./routes/proyecto');
app.use('/api', rutas);