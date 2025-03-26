const express = require('express');
const router = express.Router();
const db = require('./DB');
const bcrypt = require('bcrypt');

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
    const { nombre, email, password, tipo } = req.body;
    const contrasena_hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = { nombre, correo: email, contrasena_hash, rol: tipo };
    db.query('INSERT INTO Usuario SET ?', nuevoUsuario, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: result.insertId, ...nuevoUsuario });
        }
    });
});

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM Usuario WHERE correo = ?', [email], async (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length > 0) {
            const usuario = results[0];
            const match = await bcrypt.compare(password, usuario.contrasena_hash);
            if (match) {
                res.json(usuario);
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para obtener el perfil del usuario
router.get('/perfil', (req, res) => {
    db.query('SELECT * FROM usuarios LIMIT 1', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para actualizar el perfil del usuario
router.put('/perfil', (req, res) => {
    const { nombre, email } = req.body;
    db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = 1', [nombre, email], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: 1, nombre, email });
        }
    });
});

// Ruta para obtener el progreso de los cursos
router.get('/progreso', (req, res) => {
    db.query('SELECT * FROM progreso', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener la lista de usuarios
router.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Usuario eliminado' });
        }
    });
});

// Ruta para obtener la lista de cursos
router.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para eliminar un curso
router.delete('/cursos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cursos WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Curso eliminado' });
        }
    });
});

module.exports = router;