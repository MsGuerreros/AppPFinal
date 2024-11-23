async function fetchTexto(providencia) {
    try {
        const response = await fetch(`http://localhost:3000/api/providencia/${providencia}`);
        if (!response.ok) {
            throw new Error('Error al obtener el texto');
        }
        const data = await response.json();

        if (data.error) {
            document.getElementById('tituloProvidencia').textContent = "Providencia no encontrada";
            return;
        }

        // Actualizar los datos en la página
        document.getElementById('tituloProvidencia').textContent = data.providencia;
        document.getElementById('tipoProvidencia').textContent = `Tipo: ${data.tipo}`;
        document.getElementById('anioProvidencia').textContent = `Año: ${data.anio}`;

        const textoDiv = document.getElementById('textoProvidencia');
        textoDiv.innerHTML = ''; // Limpiar contenido previo
        const parrafos = data.texto.split('\n');
        parrafos.forEach(parrafo => {
            const pElement = document.createElement('p');
            pElement.textContent = parrafo.trim();
            textoDiv.appendChild(pElement);
        });
    } catch (error) {
        console.error("Error al obtener el texto:", error.message);
        document.getElementById('textoProvidencia').textContent = "Error al cargar el texto.";
    }
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const providencia = urlParams.get('providencia');
    if (providencia) {
        fetchTexto(providencia);
    } else {
        document.getElementById('tituloProvidencia').textContent = "No se especificó ninguna providencia.";
    }
};
