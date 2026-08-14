//1. importar las dependencias 
const express = require('express');
const cors = require('cors');

//2. crear la aplicacion y definir el puerto 
const app = express();  
const PORT = 3000;  

//3. activar middleawares
app.use(cors());
app.use(express.json());

//4. ruta het / api/ productos 
app.get('/api/productos',(req, res) => {
    const productos = require ('../frontend/data/productos.json');
    res.json(productos);
});

//5. ruta de prueba 
app.get('/', (req, res) => {
    res.json({mensaje: 'servidor techstore pro'});
});

//6. arrancar el servidor 
app.listen(PORT, ()=> {
    console.log(`servidor en https://localhost:${PORT}`);
});