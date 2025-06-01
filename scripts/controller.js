document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('registroForm')) {
        document.getElementById('registroForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const tipo = document.getElementById('tipo').value;

            fetch('http://localhost:3000/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo: email, password, tipo })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    window.location.reload(); // Recargar la página después del registro
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Error en registro:', error));
        });
    }
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.id_usuario) {
                    localStorage.setItem('id_usuario', data.id_usuario);
                    localStorage.setItem('nombre', data.nombre); // data.nombre debe venir del backend
                    localStorage.setItem('rol_usuario', data.rol);

                    if (data.rol === 'admin') {
                        window.location.href = 'Perfiladmin.html'; // Redirigir al perfil de administrador
                    } else {
                        window.location.href = 'Usuario.html'; // Redirigir al perfil de estudiante
                    }
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Error en login:', error));
        });
    }
    if (document.getElementById('perfilForm')) {
        cargarPerfil();
        document.getElementById('perfilForm').addEventListener('submit', handlePerfilUpdate);
    }
    if (document.getElementById('progreso-lista')) {
        cargarProgreso();
    }
    if (document.getElementById('usuarios-lista')) {
        cargarUsuarios();
    }
    if (document.getElementById('cursos-lista')) {
        cargarCursos();
    }
    if (document.getElementById('formAgregarCurso')) {
        document.getElementById('formAgregarCurso').addEventListener('submit', event => {
            event.preventDefault();

            const nombreCurso = document.getElementById('nombreCurso').value.trim();
            const descripcionCurso = document.getElementById('descripcionCurso').value.trim();
            const enlaceCurso = document.getElementById('enlaceCurso').value;

            // Validar que el nombre del curso no se repita
            fetch('http://localhost:3000/api/cursos')
                .then(response => response.json())
                .then(cursos => {
                    const nombresExistentes = cursos.map(curso => curso.nombre_curso.toLowerCase());
                    if (nombresExistentes.includes(nombreCurso.toLowerCase())) {
                        alert('El nombre del curso ya existe. Por favor, elige otro nombre.');
                        return;
                    }

                    // Si el nombre no se repite, enviar la solicitud para agregar el curso
                    fetch('http://localhost:3000/api/cursos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre_curso: nombreCurso, descripcion: descripcionCurso, enlace: enlaceCurso })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {
                                alert(data.message); // Mostrar el mensaje del backend
                                cargarCursos(); // Actualizar la lista de cursos
                            } else if (data.error) {
                                alert(`Error: ${data.error}`); // Mostrar el error del backend
                            } else {
                                alert('Hubo un problema al agregar el curso.');
                            }
                        })
                        .catch(error => console.error('Error al agregar el curso:', error));
                })
                .catch(error => console.error('Error al validar el nombre del curso:', error));
        });
    }
});

// Guardar el estado de sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const tipoUsuario = window.location.pathname.includes('Perfiladmin.html') ? 'admin' : 'usuario';
    const idUsuario = localStorage.getItem('id_usuario'); // Asegúrate de que este valor esté configurado al iniciar sesión

    if (!idUsuario) {
        alert('No se encontró una sesión activa. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html'; // Redirige al inicio de sesión si no hay sesión activa
        return;
    }

    // Guardar el estado de sesión en localStorage
    localStorage.setItem('sesion_activa', JSON.stringify({
        idUsuario: idUsuario,
        tipoUsuario: tipoUsuario,
        timestamp: Date.now()
    }));

    // Guardar la marca de tiempo en sessionStorage para la pestaña actual
    sessionStorage.setItem('sesion_timestamp', Date.now());
});

document.addEventListener('DOMContentLoaded', cargarCursos);

document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes();
});

function cargarPerfil() {
    fetch('http://localhost:3000/api/perfil')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('email').value = data.email;
    })
    .catch(error => console.error('Error:', error));
}

function handlePerfilUpdate(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    const perfilData = { nombre, email };

    fetch('http://localhost:3000/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfilData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Perfil actualizado exitosamente');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el perfil');
    });
}

function cargarProgreso() {
    fetch('http://localhost:3000/api/progreso')
    .then(response => response.json())
    .then(data => {
        const progresoLista = document.getElementById('progreso-lista');
        progresoLista.innerHTML = '';
        data.forEach(progreso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${progreso.curso}</td>
                <td>${progreso.tema}</td>
                <td>${progreso.porcentaje}%</td>
                <td>
                    <button onclick="actualizarProgreso('${progreso.id}')">Actualizar Progreso</button>
                </td>
            `;
            progresoLista.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function actualizarProgreso(id) {
    // Lógica para actualizar el progreso del curso
    alert('Actualizar progreso del curso: ' + id);
    // Aquí puedes implementar la lógica para actualizar el progreso en el servidor
}

function cargarUsuarios() {
    fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const usuariosLista = document.getElementById('usuarios-lista');
            usuariosLista.innerHTML = '';
            data.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.rol}</td>                    
                    <td>
                        <button onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
                        <button onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
                    </td>
                `;
                usuariosLista.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar usuarios:', error));
}

function editarUsuario(id) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevoCorreo = prompt('Ingrese el nuevo correo:');
    if (nuevoNombre && nuevoCorreo) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, correo: nuevoCorreo })
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario actualizado correctamente');
            cargarUsuarios();
        })
        .catch(error => console.error('Error al actualizar usuario:', error));
    }
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario eliminado correctamente');
            cargarUsuarios();
        })
        .catch(error => console.error('Error al eliminar usuario:', error));
    }
}

function cargarCursos() {
    fetch('http://localhost:3000/api/cursos')
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-lista');
            cursosLista.innerHTML = '';
            data.forEach(curso => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${curso.id_curso}</td>
                    <td>${curso.nombre_curso}</td>
                    <td>${curso.descripcion}</td>
                    <td><a href="${curso.enlace}" target="_blank">Ver Curso</a></td>
                    <td>
                        <button onclick="editarCurso(${curso.id_curso})">Editar</button>
                        <button onclick="eliminarCurso(${curso.id_curso})">Eliminar</button>
                        
                    </td>
                `;
                cursosLista.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los cursos:', error));
}

function editarCurso(id) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre del curso:');
    const nuevaDescripcion = prompt('Ingrese la nueva descripción del curso:');
    const nuevoEnlace = prompt('Ingrese el nuevo enlace del curso (por ejemplo: basico.html, intermedio.html, avanzado.html):');

    if (nuevoNombre && nuevaDescripcion && nuevoEnlace) {
        fetch(`http://localhost:3000/api/cursos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_curso: nuevoNombre,
                descripcion: nuevaDescripcion,
                enlace: nuevoEnlace
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al editar el curso');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Curso editado correctamente');
            cargarCursos(); // Recargar la lista de cursos
        })
        .catch(error => {
            console.error('Error al editar el curso:', error);
            alert('Hubo un error al editar el curso.');
        });
    } else {
        alert('Todos los campos son obligatorios para editar el curso.');
    }
}

function eliminarCurso(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        fetch(`http://localhost:3000/api/cursos/${id}`, { // Cambia la URL si es necesario
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el curso');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Curso eliminado correctamente');
            cargarCursos(); // Actualiza la lista de cursos después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar el curso:', error);
            alert('Hubo un error al eliminar el curso.');
        });
    }
}

// Función para inscribir a un curso
function inscribirCurso(id_curso) {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
        alert('Debes iniciar sesión.');
        return;
    }
    fetch('http://localhost:3000/api/inscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_curso })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            cargarCursosInscritos();
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error al inscribir:', error));
}

// Función para cargar los cursos inscritos
function cargarCursosInscritos() {
    const id_usuario = localStorage.getItem('id_usuario');
    fetch(`http://localhost:3000/api/cursos-inscritos/${id_usuario}`)
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-inscritos-lista');
            cursosLista.innerHTML = '';
            if (data.length === 0) {
                cursosLista.innerHTML = '<tr><td colspan="3">No estás inscrito en ningún curso.</td></tr>';
            } else {
                data.forEach(curso => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${curso.nombre_curso}</td>
                        <td>${curso.descripcion}</td>
                        <td><a href="#">Acceder</a></td>
                    `;
                    cursosLista.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error al cargar cursos inscritos:', error));
}

function cargarEstudiantes() {
    fetch('http://localhost:3000/api/estudiantes')
        .then(response => response.json())
        .then(data => {
            const estudiantesLista = document.getElementById('estudiantes-lista');
            estudiantesLista.innerHTML = ''; // Limpiar la tabla antes de llenarla
            data.forEach(estudiante => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${estudiante.id_usuario}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.correo}</td>
                    <td>
                        <button onclick="editarEstudiante(${estudiante.id_usuario})">Editar</button>
                        <button onclick="eliminarEstudiante(${estudiante.id_usuario})">Eliminar</button>
                    </td>
                `;
                estudiantesLista.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar estudiantes:', error));
}

function editarEstudiante(id) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevoCorreo = prompt('Ingrese el nuevo correo:');
    const nuevaContrasena = prompt('Ingrese la nueva contraseña (dejar en blanco para no cambiarla):');

    if (nuevoNombre && nuevoCorreo) {
        fetch(`http://localhost:3000/api/estudiantes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, correo: nuevoCorreo, password: nuevaContrasena || null })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cargarEstudiantes(); // Recargar la lista de estudiantes
        })
        .catch(error => console.error('Error al editar estudiante:', error));
    }
}

function eliminarEstudiante(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
        fetch(`http://localhost:3000/api/estudiantes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cargarEstudiantes(); // Recargar la lista de estudiantes
        })
        .catch(error => console.error('Error al eliminar estudiante:', error));
    }
}