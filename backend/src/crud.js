const express = require('express');
const router = express.Router();
const db = require('./DB');
const bcrypt = require('bcrypt');

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
    const { nombre, correo, password, tipo } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
        db.query(
            'INSERT INTO Usuario (nombre, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre, correo, hashedPassword, tipo],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: 'El correo ya está registrado.' });
                    } else {
                        res.status(500).json({ error: err.message });
                    }
                } else {
                    res.status(201).json({ message: 'Usuario registrado correctamente' });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Usuario WHERE correo = ?', [email], async (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length > 0) {
            const usuario = results[0];
            try {
                const match = await bcrypt.compare(password, usuario.contrasena_hash);
                if (match) {
                    res.json({ id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol });
                } else {
                    res.status(401).json({ error: 'Credenciales incorrectas' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Error interno al validar las credenciales' });
            }
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para inscribir a un usuario en un curso
router.post('/inscribir', (req, res) => {
    const { id_usuario, id_curso } = req.body;

    // Verificar el rol del usuario
    db.query('SELECT rol FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al verificar el rol del usuario:', err.message);
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else if (results[0].rol !== 'usuario') {
            res.status(403).json({ error: 'Solo los usuarios con rol de "usuario" pueden inscribirse en cursos.' });
        } else {
            // Si el rol es "usuario", proceder con la inscripción
            db.query(
                'INSERT INTO Inscripcion (id_usuario, id_curso) VALUES (?, ?)',
                [id_usuario, id_curso],
                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            res.status(400).json({ error: 'El usuario ya está inscrito en este curso.' });
                        } else {
                            res.status(500).json({ error: err.message });
                        }
                    } else {
                        res.status(201).json({ message: 'Inscripción registrada correctamente' });
                    }
                }
            );
        }
    });
});

// Ruta para obtener los cursos inscritos por el usuario
router.get('/cursos-inscritos/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        `SELECT C.id_curso, C.nombre_curso, C.descripcion, C.enlace
         FROM Inscripcion I
         JOIN Curso C ON I.id_curso = C.id_curso
         WHERE I.id_usuario = ?`,
        [id_usuario],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        }
    );
});

// Ruta para agregar un curso
router.post('/cursos', (req, res) => {
    const { nombre_curso, descripcion, enlace } = req.body;

    db.query(
        'INSERT INTO Curso (nombre_curso, descripcion, enlace) VALUES (?, ?, ?)',
        [nombre_curso, descripcion, enlace],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ message: 'Curso agregado correctamente' });
            }
        }
    );
});

// Ruta para obtener la lista de cursos
router.get('/cursos', (req, res) => {
    db.query('SELECT * FROM Curso', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener todos los estudiantes
router.get('/estudiantes', (req, res) => {
    db.query('SELECT id_usuario, nombre, correo, contrasena_hash FROM Usuario WHERE rol = "estudiante"', (err, results) => {
        if (err) {
            console.error('Error al obtener estudiantes:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para actualizar un estudiante
router.put('/estudiantes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password } = req.body;

    try {
        let query = 'UPDATE Usuario SET nombre = ?, correo = ?';
        const params = [nombre, correo];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', contrasena_hash = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id_usuario = ? AND rol = "estudiante"';
        params.push(id);

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al actualizar estudiante:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Estudiante actualizado correctamente' });
            }
        });
    } catch (error) {
        console.error('Error al actualizar estudiante:', error.message);
        res.status(500).json({ error: 'Error al actualizar estudiante.' });
    }
});

// Ruta para eliminar un estudiante
router.delete('/estudiantes/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM Usuario WHERE id_usuario = ? AND rol = "estudiante"',
        [id],
        (err, result) => {
            if (err) {
                console.error('Error al eliminar estudiante:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Estudiante eliminado correctamente' });
            }
        }
    );
});

// Ruta para actualizar el perfil del usuario
router.put('/usuario', async (req, res) => {
    const { id_usuario, nombre, email, password } = req.body;

    try {
        let query = 'UPDATE Usuario SET nombre = ?, correo = ?';
        const params = [nombre, email];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', contrasena_hash = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id_usuario = ?';
        params.push(id_usuario);

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al actualizar perfil:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Perfil actualizado correctamente' });
            }
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error.message);
        res.status(500).json({ error: 'Error al actualizar perfil.' });
    }
});

// Ruta para eliminar el perfil del usuario
router.delete('/usuario', (req, res) => {
    const { id_usuario } = req.body;

    db.query('DELETE FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, result) => {
        if (err) {
            console.error('Error al eliminar perfil:', err.message);
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Perfil eliminado correctamente' });
        }
    });
});

// Ruta para obtener el rol de un usuario
router.get('/usuario/rol/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        'SELECT rol FROM Usuario WHERE id_usuario = ?',
        [id_usuario],
        (err, results) => {
            if (err) {
                console.error('Error al obtener el rol del usuario:', err.message);
                res.status(500).json({ error: err.message });
            } else if (results.length === 0) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.json({ rol: results[0].rol });
            }
        }
    );
});

module.exports = router;