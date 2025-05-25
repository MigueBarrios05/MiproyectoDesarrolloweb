document.addEventListener('DOMContentLoaded', () => {
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    document.getElementById('bienvenida').textContent = `Bienvenido, ${nombre}`;
    cargarCursos();
    cargarCursosInscritos();
    cargarCertificados();
});

// Cargar cursos disponibles desde el backend
function cargarCursos() {
    fetch('http://localhost:3000/api/cursos')
        .then(response => response.json())
        .then(cursos => {
            const cursosDisponiblesLista = document.getElementById('cursos-disponibles-lista');
            cursosDisponiblesLista.innerHTML = '';
            cursos.forEach(curso => {
                const fila = `
                    <tr>
                        <td>${curso.nombre_curso}</td>
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

// Cargar cursos inscritos del usuario
function cargarCursosInscritos() {
    const id_usuario = localStorage.getItem('id_usuario');
    fetch(`http://localhost:3000/api/cursos-inscritos/${id_usuario}`)
        .then(response => response.json())
        .then(data => {
            const cursosLista = document.getElementById('cursos-inscritos-lista');
            cursosLista.innerHTML = '';
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

// Inscribir al usuario en un curso
function inscribirCurso(id_curso) {
    const id_usuario = localStorage.getItem('id_usuario');
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
                        alert(data.message);
                        cargarCursosInscritos();
                    } else if (data.error) {
                        alert(`Error: ${data.error}`);
                    } else {
                        alert('Hubo un problema al inscribir al curso.');
                    }
                })
                .catch(error => console.error('Error al inscribir al curso:', error));
        }
// Acceder a un curso (con código de pago)
function accederCurso(id_curso, codigo_pago) {
    const codigoIngresado = prompt('Por favor, ingresa el código de pago para este curso:');
    if (codigoIngresado === codigo_pago) {
        alert('Código válido. Accediendo al curso...');
        window.location.href = `/cursos/${id_curso}.html`;
    } else {
        alert('Código inválido. Por favor, verifica e intenta nuevamente.');
    }
}

// Actualizar perfil del usuario
document.getElementById('perfilForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id_usuario = localStorage.getItem('id_usuario');
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const datosActualizar = { id_usuario };
    if (nombre) datosActualizar.nombre = nombre;
    if (email) datosActualizar.email = email;
    if (password) datosActualizar.password = password;

    if (!nombre && !email && !password) {
        alert('Debes llenar al menos un campo para actualizar.');
        return;
    }

    fetch('http://localhost:3000/api/usuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizar)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar el perfil');
        return response.json();
    })
    .then(data => {
        alert(data.message);
        if (nombre) {
            localStorage.setItem('nombre', nombre);
            document.getElementById('bienvenida').textContent = `Bienvenido, ${nombre}`;
        }
    })
    .catch(error => console.error('Error al actualizar el perfil:', error));
});

// Eliminar perfil del usuario
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
            localStorage.clear();
            window.location.href = 'registro.html';
        })
        .catch(error => console.error('Error al eliminar el perfil:', error));
    }
}
);

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('email');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
}

// Cargar certificados del usuario
function cargarCertificados() {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtén el ID del usuario desde localStorage

    if (!id_usuario) {
        console.error("No se encontró el ID del usuario en localStorage.");
        return;
    }

    fetch(`http://localhost:3000/api/certificados/${id_usuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los certificados');
            }
            return response.json();
        })
        .then(data => {
            const certificadosLista = document.getElementById('certificados-lista');
            certificadosLista.innerHTML = ''; // Limpia el contenedor antes de llenarlo

            if (data.length === 0) {
                certificadosLista.innerHTML = '<p>No tienes certificados generados.</p>';
            } else {
                data.forEach(certificado => {
                    const item = document.createElement('div');
                    item.classList.add('certificado-item');
                    item.innerHTML = `
                        <h4>${certificado.nombre_curso}</h4>
                        <p>Fecha de emisión: ${new Date(certificado.fecha_emision).toLocaleDateString()}</p>
                        <a href="certificado.html?id_curso=${certificado.id_curso}&id_usuario=${id_usuario}" 
                           class="btn btn-primary rounded-pill" target="_blank">
                           Ver Certificado
                        </a>
                    `;
                    certificadosLista.appendChild(item);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar los certificados:', error);
        });
}

// Llama a la función al cargar la página del perfil
document.addEventListener('DOMContentLoaded', cargarCertificados);

function eliminarMiCuenta() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
        alert('No se pudo identificar al usuario.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        fetch(`http://localhost:3000/api/usuarios/${id_usuario}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Cuenta eliminada correctamente');
            localStorage.clear(); // Limpiar datos del usuario
            window.location.href = 'index.html'; // Redirigir al inicio
        })
        .catch(error => {
            console.error('Error al eliminar la cuenta:', error);
            alert('Hubo un error al eliminar la cuenta.');
        });
    }
}

