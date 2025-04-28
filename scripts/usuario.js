document.addEventListener('DOMContentLoaded', () => {
    obtenerRolUsuario();
    cargarCursosInscritos(); // Cargar cursos inscritos para estudiantes
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
}

function inscribirUsuario(id_curso) {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde el almacenamiento local

    fetch('http://localhost:3000/api/inscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_curso })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al inscribir al curso');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Mostrar mensaje de éxito
        cargarCursosInscritos(); // Recargar la lista de cursos inscritos
    })
    .catch(error => console.error('Error al inscribir al curso:', error));
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
                        <a href="${curso.enlace}" target="_blank">Ir al curso</a>
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
            } else if (data.rol === 'usuario') {
                mostrarContenidoEstudiante();
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

