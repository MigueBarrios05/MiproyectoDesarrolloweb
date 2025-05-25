let moduloActual = 1; // Comienza en el módulo 1

// Función para mostrar un módulo específico
function mostrarModulo(numeroModulo) {
    // Selecciona todos los módulos
    const modulos = document.querySelectorAll('.modulo');

    // Verifica si hay módulos en el DOM
    if (modulos.length === 0) {
        console.error('No se encontraron módulos en el DOM.');
        return;
    }

    // Oculta todos los módulos
    modulos.forEach(modulo => {
        modulo.style.display = 'none';
    });

    // Muestra el módulo seleccionado
    const moduloSeleccionado = document.getElementById(`modulo${numeroModulo}`);
    if (moduloSeleccionado) {
        moduloSeleccionado.style.display = 'block';
        moduloActual = numeroModulo;
    } else {
        console.error(`No se encontró el módulo con ID: modulo${numeroModulo}`);
    }
}