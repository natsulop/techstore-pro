//1. importar las dependencias 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');


//2. crear la aplicacion y definir el puerto 
const app = express();  
const PORT = process.env.PORT || 3000;  
 
//3. activar middleawares
app.use(cors());
app.use(express.json());

//4. conectar a mongosdb atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✔️Conectado a mongoDB Atlas'))
    .catch((err)=> console.error('✖️ Error de conexion:',err))
    

// 5. Ruta Get /api /productos - ahora lee de mongodb atlas
app.get('/api/producto',async(req,res)=> {
    try {
        const productos = await Producto.find();
        res.jsonp(productos);
    } catch (err) {
    res.status(500).json({error: 'error al obtener productos'});
    }
})
//6. ruta de prueba 
app.get('/', (req, res) => {
    res.json({mensaje: 'servidor techstore pro'});
});

//6. arrancar el servidor 
app.listen(PORT, ()=> {
    console.log(`servidor en https://localhost:${PORT}`);
});

