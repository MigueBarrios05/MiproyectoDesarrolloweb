document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id_usuario = params.get('usuario');
    const id_curso = params.get('curso');

    fetch(`http://localhost:3000/api/certificado/${id_usuario}/${id_curso}`)
        .then(response => response.json())
        .then(data => {
            if (data.enlace_certificado) {
                const certificadoContainer = document.getElementById('certificado-container');
                certificadoContainer.innerHTML = `
                    <iframe src="${data.enlace_certificado}" width="100%" height="500px" class="shadow rounded"></iframe>
                `;
            } else {
                alert('No se encontró el certificado.');
            }
        })
        .catch(error => console.error('Error al cargar el certificado:', error));
});