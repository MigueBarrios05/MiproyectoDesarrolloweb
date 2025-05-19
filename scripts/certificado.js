document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id_curso = params.get('id_curso');
    const id_usuario = params.get('id_usuario');

    if (!id_curso || !id_usuario) {
        document.getElementById('certificado-detalles').innerHTML = `
            <p class="text-danger">No se encontraron los datos del certificado.</p>
        `;
        return;
    }

    fetch(`http://localhost:3000/api/certificados/${id_usuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el certificado');
            }
            return response.json();
        })
        .then(data => {
            const certificado = data.find(c => c.id_curso == id_curso);

            if (!certificado) {
                document.getElementById('certificado-detalles').innerHTML = `
                    <p class="text-danger">Certificado no encontrado.</p>
                `;
                return;
            }

            document.getElementById('certificado-detalles').innerHTML = `
                <h2>${certificado.nombre_curso}</h2>
                <p>Fecha de emisión: ${new Date(certificado.fecha_emision).toLocaleDateString()}</p>
                <p class="text-success">¡Felicidades por completar el curso!</p>
            `;
        })
        .catch(error => {
            console.error('Error al cargar el certificado:', error);
            document.getElementById('certificado-detalles').innerHTML = `
                <p class="text-danger">Error al cargar el certificado.</p>
            `;
        });
});