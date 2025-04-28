document.addEventListener('DOMContentLoaded', function () {
    const cursoSelect = document.getElementById('curso');
    const precioInput = document.getElementById('precio');
    const formularioPago = document.getElementById('formularioPago');

    // Precios de los cursos según el nivel de dificultad
    const precios = {
        basico: 100000,
        intermedio: 175000,
        avanzado: 250000
    };

    // Actualizar el precio cuando se selecciona un curso
    cursoSelect.addEventListener('change', function () {
        const cursoSeleccionado = cursoSelect.value;
        precioInput.value = `$${precios[cursoSeleccionado] || 0}`;
    });

    // Manejar el envío del formulario
    formularioPago.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const curso = cursoSelect.value;
        const monto = precioInput.value;

        if (!curso || !email) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Obtener el id_inscripcion del usuario
        fetch(`http://localhost:3000/api/usuario/${email}`)
            .then(response => response.json())
            .then(data => {
                const id_inscripcion = data.id_inscripcion;

                // Registrar el pago en la tabla Factura
                fetch('http://localhost:3000/api/factura', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_inscripcion, curso, monto })
                })
                    .then(response => response.json())
                    .then(data => {
                        alert('Pago registrado con éxito. Ahora tienes acceso al curso.');
                        window.location.href = 'Usuario.html'; // Redirigir al perfil del usuario
                    })
                    .catch(error => {
                        console.error('Error al registrar el pago:', error);
                        alert('Hubo un error al procesar el pago.');
                    });
            })
            .catch(error => {
                console.error('Error al obtener el id_inscripcion:', error);
                alert('No se pudo obtener la información del usuario.');
            });
    });
});