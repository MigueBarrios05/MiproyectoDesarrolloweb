document.addEventListener('DOMContentLoaded', () => {
    cargarCursos(); // Cargar los cursos disponibles
    cargarCursosInscritos(); // Cargar los cursos inscritos del usuario
});

console.log(localStorage.getItem('id_usuario'));

function cargarCursosPagados() {
    const email = localStorage.getItem('email'); // Obtener el correo del usuario desde el almacenamiento local

    fetch(`http://localhost:3000/api/cursos-pagados/${email}`)
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-lista');
            cursosLista.innerHTML = '';
            if (data.length === 0) {
                cursosLista.innerHTML = '<tr><td colspan="3">No tienes cursos pagados.</td></tr>';
            } else {
                data.forEach(curso => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${curso.nombre_curso}</td>
                        <td>${curso.descripcion}</td>
                        <td>
                            <button onclick="accederCurso(${curso.id_curso}, '${curso.codigo_pago}')">Acceder</button>
                        </td>
                    `;
                    cursosLista.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error al cargar los cursos pagados:', error));
}

function cargarPerfil() {
    const email = localStorage.getItem('email'); // Obtener el correo del usuario desde el almacenamiento local

    fetch(`http://localhost:3000/api/perfil/${email}`)
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-lista');
            cursosLista.innerHTML = '';
            if (data.length === 0) {
                cursosLista.innerHTML = '<tr><td colspan="3">No tienes cursos pagados.</td></tr>';
            } else {
                data.forEach(curso => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${curso.nombre_curso}</td>
                        <td>${curso.descripcion}</td>
                        <td>
                            <button onclick="accederCurso(${curso.id_curso}, '${curso.codigo_pago}')">Acceder</button>
                        </td>
                    `;
                    cursosLista.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error al cargar el perfil:', error));
}

function cerrarSesion() {
    localStorage.removeItem('email'); // Eliminar el correo del almacenamiento local
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html'; // Redirigir al usuario a la página de inicio
}

function actualizarPerfil(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    fetch('http://localhost:3000/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
    })
        .then(response => response.json())
        .then(data => {
            alert('Perfil actualizado correctamente');
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
            alert('Hubo un error al actualizar el perfil.');
        });
}

function eliminarPerfil() {
    const email = localStorage.getItem('email'); // Obtener el correo del usuario desde el almacenamiento local

    if (confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
        fetch(`http://localhost:3000/api/perfil/${email}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert('Perfil eliminado correctamente');
                cerrarSesion(); // Cerrar sesión después de eliminar el perfil
            })
            .catch(error => {
                console.error('Error al eliminar el perfil:', error);
                alert('Hubo un error al eliminar el perfil.');
            });
    }
}

function accederCurso(id_curso, codigo_pago) {
    const codigoIngresado = prompt('Por favor, ingresa el código de pago para este curso:');

    if (codigoIngresado === codigo_pago) {
        alert('Código válido. Accediendo al curso...');
        window.location.href = `/cursos/${id_curso}.html`; // Redirigir al curso
    } else {
        alert('Código inválido. Por favor, verifica e intenta nuevamente.');
    }
}

function inscribirCurso(id_curso) {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde el almacenamiento local

    if (!id_usuario) {
        alert('Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
        return;
    }

    // Verificar el rol del usuario
    fetch(`http://localhost:3000/api/usuario/rol/${id_usuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.rol !== 'estudiante') { // Cambiar "usuario" por "estudiante"
                alert('Error: Solo los usuarios con rol de "estudiante" pueden inscribirse en cursos.');
                return;
            }

            // Si el rol es válido, proceder con la inscripción
            fetch('http://localhost:3000/api/inscribir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, id_curso })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message); // Mostrar el mensaje del backend
                        cargarCursosInscritos(); // Actualizar la lista de cursos inscritos
                    } else if (data.error) {
                        alert(`Error: ${data.error}`); // Mostrar el error del backend
                    } else {
                        alert('Hubo un problema al inscribir al curso.');
                    }
                })
                .catch(error => console.error('Error al inscribir al curso:', error));
        })
        .catch(error => console.error('Error al verificar el rol del usuario:', error));
}

function inscribirUsuario(nombre, descripcion, enlace) {
    const tablaCursosInscritos = document.getElementById('cursos-inscritos-lista');

    // Crear una nueva fila para el curso inscrito
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${descripcion}</td>
        <td><a href="${enlace}" class="btn btn-primary rounded-pill">Acceder</a></td>
    `;

    // Agregar la nueva fila a la tabla de cursos inscritos
    tablaCursosInscritos.appendChild(nuevaFila);

    // Mostrar un mensaje de éxito
    alert(`Te has inscrito exitosamente en el curso: ${nombre}`);
}

function cargarCursosInscritos() {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde el almacenamiento local

    fetch(`http://localhost:3000/api/cursos-inscritos/${id_usuario}`)
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-inscritos-lista');
            cursosLista.innerHTML = ''; // Limpiar la tabla antes de llenarla

            data.forEach(curso => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${curso.nombre_curso}</td>
                    <td>${curso.descripcion}</td>
                    <td>
                        <a href="${curso.enlace}" target="_blank" class="btn btn-primary rounded-pill">Ir al curso</a>
                    </td>
                `;
                cursosLista.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar cursos inscritos:', error));
}

function iniciarSesion(email, password) {
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.id_usuario) {
                localStorage.setItem('id_usuario', data.id_usuario); // Guardar el ID del usuario
                localStorage.setItem('rol', data.rol); // Guardar el rol del usuario
                alert('Inicio de sesión exitoso');
                window.location.href = 'Usuario.html'; // Redirigir al perfil del usuario
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error al iniciar sesión:', error));
}

function obtenerRolUsuario() {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde el almacenamiento local

    fetch(`http://localhost:3000/api/usuario/rol/${id_usuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.rol === 'admin') {
                mostrarContenidoAdmin();
            } else if (data.rol === 'estudiante') { // Cambiar "usuario" por "estudiante"
                mostrarContenidoEstudiante();
            } else {
                alert('Error: Rol no reconocido.');
            }
        })
        .catch(error => console.error('Error al obtener el rol del usuario:', error));
}

function mostrarContenidoAdmin() {
    document.getElementById('inscripcion-cursos').style.display = 'none'; // Ocultar sección de inscripción
    document.getElementById('cursos-disponibles').style.display = 'none'; // Ocultar cursos disponibles
}

function mostrarContenidoEstudiante() {
    document.getElementById('inscripcion-cursos').style.display = 'block'; // Mostrar inscripción
    document.getElementById('cursos-disponibles').style.display = 'block'; // Mostrar cursos disponibles
}

// Función para cargar los cursos desde un archivo JSON
function cargarCursos() {
    fetch('http://localhost:3000/api/cursos') // Endpoint para obtener los cursos
        .then(response => response.json())
        .then(cursos => {
            const cursosDisponiblesLista = document.getElementById('cursos-disponibles-lista');
            cursosDisponiblesLista.innerHTML = ''; // Limpiar la tabla

            cursos.forEach(curso => {
                const fila = `
                    <tr>
                        <td>${curso.nombre}</td>
                        <td>${curso.descripcion}</td>
                        <td>
                            <button class="btn btn-success rounded-pill" onclick="inscribirCurso(${curso.id_curso})">Inscribirse</button>
                        </td>
                    </tr>
                `;
                cursosDisponiblesLista.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error al cargar los cursos:', error));
}

function cargarCertificados() {
    const id_usuario = localStorage.getItem('id_usuario');

    fetch(`http://localhost:3000/api/certificados/${id_usuario}`)
        .then(response => response.json())
        .then(certificados => {
            const certificadosContainer = document.getElementById('certificados-container');
            certificados.forEach(certificado => {
                const div = document.createElement('div');
                div.className = 'mb-3';
                div.innerHTML = `
                    <h5>${certificado.nombre_curso}</h5>
                    <a href="${certificado.enlace_certificado}" target="_blank" class="btn btn-success">Ver Certificado</a>
                `;
                certificadosContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error al cargar los certificados:', error));
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarCursos);

document.getElementById('perfilForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde el almacenamiento local
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/usuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, nombre, email, password: password || null }) // Si no se cambia la contraseña, se envía null
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el perfil');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Mostrar mensaje de éxito
        // Opcional: Recargar la página o actualizar la interfaz
    })
    .catch(error => console.error('Error al actualizar el perfil:', error));
});

document.getElementById('eliminarPerfilButton').addEventListener('click', function () {
    if (confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
        const id_usuario = localStorage.getItem('id_usuario');

        fetch('http://localhost:3000/api/usuario', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'registro.html';
        })
        .catch(error => console.error('Error al eliminar el perfil:', error));
    }
});

