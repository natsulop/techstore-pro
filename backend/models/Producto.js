//Importar mongoose para usar schema y model
const mongoose = require('mongoose');

// schema: define los casmpos de cada documento en atlas 
const productoSchema = new mongoose.Schema({
    id:          { type: Number, required: true}, // numero (1,2,3.....)
    icono:          { type: String, required: true }, // emoji del producto
    nombre:         { type: String, required: true }, // nombre  del producto
    descripcion:    { type: String, required: true }, //  texto descriptivo
    precio:         { type: String, required: true }, //  "$8.999.000"- texto no numero 
    imagen:         { type: String, required: true } // ruta de imagen
});

// crea el model - mongoose busca la coleccion 'productos' en atlas
const producto = mongoose.model('Producto', productoSchema);

// Exportar para poder usarlo en server.js
module.exports = producto;
