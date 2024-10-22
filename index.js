const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Para trabajar con archivos
const app = express();
const port = 3000;

// Middleware para manejar JSON y CORS
app.use(express.json());
app.use(cors());

// Ruta del archivo JSON donde se guardarán los usuarios
const USERS_FILE = './users.json';

// Función para cargar los usuarios desde el archivo JSON
const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8'); // Leer el archivo
        return JSON.parse(data); // Convertir los datos JSON a un objeto JavaScript
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
        return []; // Si hay un error, retornamos un arreglo vacío
    }
};

// Función para guardar los usuarios en el archivo JSON
const saveUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); // Guardar datos como JSON
    } catch (error) {
        console.error('Error al guardar usuarios en el archivo:', error);
    }
};

// Cargar los usuarios del archivo cuando inicie el servidor
let users = loadUsers();

// Servicio GET para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

// Servicio POST para agregar un nuevo usuario
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser); // Agregar el nuevo usuario a la lista
    saveUsers(users); // Guardar en el archivo
    res.status(201).json({ message: 'Usuario agregado', user: newUser });
});

// Servicio PUT para actualizar un usuario
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    users = users.map(user => (user.id === userId ? updatedUser : user)); // Actualizar usuario
    saveUsers(users); // Guardar en el archivo
    res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
});

// Servicio DELETE para eliminar un usuario
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    users = users.filter(user => user.id !== userId); // Filtrar usuarios
    saveUsers(users); // Guardar en el archivo
    res.status(200).json({ message: 'Usuario eliminado' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});




