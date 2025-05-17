document.addEventListener('DOMContentLoaded', () => {
    const id_curso = 1; // ID del curso básico
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario

    cargarModulos(id_curso, id_usuario);
    verificarProgresoCurso(id_curso, id_usuario);
});

function cargarModulos(id_curso, id_usuario) {
    fetch(`http://localhost:3000/api/modulos/${id_curso}/${id_usuario}`)
        .then(response => response.json())
        .then(modulos => {
            const modulosLista = document.getElementById('modulos-lista');
            modulosLista.innerHTML = ''; // Limpiar la lista antes de llenarla

            modulos.forEach(modulo => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <span>${modulo.nombre_modulo}: ${modulo.descripcion}</span>
                    <button class="btn btn-sm ${modulo.completado ? 'btn-success' : 'btn-secondary'}" 
                            onclick="marcarModuloComoCompletado(${modulo.id_modulo})" 
                            ${modulo.completado ? 'disabled' : ''}>
                        ${modulo.completado ? 'Completado' : 'Completar'}
                    </button>
                `;
                modulosLista.appendChild(li);
            });
        })
        .catch(error => console.error('Error al cargar los módulos:', error));
}

function marcarModuloComoCompletado(id_modulo) {
    const id_usuario = localStorage.getItem('id_usuario');

    fetch('http://localhost:3000/api/modulos/completar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_modulo })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const id_curso = 1; // ID del curso básico
            verificarProgresoCurso(id_curso, id_usuario);
            cargarModulos(id_curso, id_usuario); // Recargar los módulos
        })
        .catch(error => console.error('Error al marcar el módulo como completado:', error));
}

function verificarProgresoCurso(id_curso, id_usuario) {
    fetch(`http://localhost:3000/api/modulos/completados/${id_usuario}/${id_curso}`)
        .then(response => response.json())
        .then(data => {
            if (data.completado) {
                document.getElementById('certificado-boton').style.display = 'block';
            }
        })
        .catch(error => console.error('Error al verificar el progreso del curso:', error));
}

function generarCertificado() {
    const id_usuario = localStorage.getItem('id_usuario');
    const id_curso = 1; // ID del curso básico

    fetch('http://localhost:3000/api/certificado/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_curso })
    })
        .then(response => response.json())
        .then(data => {
            if (data.enlace_certificado) {
                // Redirigir a la vista del certificado
                window.location.href = `certificado.html?usuario=${id_usuario}&curso=${id_curso}`;
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error al generar el certificado:', error));
}