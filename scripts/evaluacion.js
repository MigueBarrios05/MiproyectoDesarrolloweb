function guardarCertificadoUsuario(nombreCurso, nombreUsuario) {
        let certificados = JSON.parse(localStorage.getItem('certificados')) || [];
        // Evita duplicados
        if (!certificados.some(c => c.curso === nombreCurso)) {
            certificados.push({
                curso: nombreCurso,
                nombre: nombreUsuario,
                fecha: new Date().toLocaleDateString()
            });
            localStorage.setItem('certificados', JSON.stringify(certificados));
        }
    }

    function guardarCertificadoEnBaseDeDatos(id_usuario, id_curso) {
        fetch('http://localhost:3000/api/certificados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, id_curso })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el certificado en la base de datos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Certificado guardado en la base de datos:', data);
        })
        .catch(error => {
            console.error('Error al guardar el certificado en la base de datos:', error);
        });
    }