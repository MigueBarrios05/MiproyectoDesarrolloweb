document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('registroForm')) {
        document.getElementById('registroForm').addEventListener('submit', handleRegistro);
    }
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
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
});

function handleRegistro(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;

    const registroData = { nombre, email, password, tipo };

    fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registroData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Registrado exitosamente');
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el registro');
    });
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const loginData = { email, password };

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.rol === 'estudiante') {
            window.location.href = 'Usuario.html';
        } else if (data.rol === 'admin') {
            window.location.href = 'Perfiladmin.html';
        } else {
            alert('Tipo de usuario desconocido');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el inicio de sesión');
    });
}

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
                <td>${usuario.email}</td>
                <td>${usuario.tipo}</td>
                <td>
                    <button onclick="editarUsuario('${usuario.id}')">Editar</button>
                    <button onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>
                </td>
            `;
            usuariosLista.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function editarUsuario(id) {
    // Lógica para editar usuario
    alert('Editar usuario: ' + id);
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario eliminado');
            cargarUsuarios();
        })
        .catch(error => console.error('Error:', error));
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
                <td>${curso.nombre}</td>
                <td>${curso.nivel}</td>
                <td>
                    <button onclick="editarCurso('${curso.id}')">Editar</button>
                    <button onclick="eliminarCurso('${curso.id}')">Eliminar</button>
                </td>
            `;
            cursosLista.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function editarCurso(id) {
    // Lógica para editar curso
    alert('Editar curso: ' + id);
}

function eliminarCurso(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        fetch(`http://localhost:3000/api/cursos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Curso eliminado');
            cargarCursos();
        })
        .catch(error => console.error('Error:', error));
    }
}