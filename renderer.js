async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function renderTable(data) {
    const tablaResultados = document.getElementById('tablaResultados').querySelector('tbody');
    const resultadosMensaje = document.getElementById('resultadosMensaje');
    
    tablaResultados.innerHTML = ''; // Limpiar la tabla

    // Mostrar cantidad de resultados
    resultadosMensaje.textContent = `Resultados encontrados: ${data.length}`;

    // Renderizar datos en la tabla
    data.forEach(item => {
        const row = document.createElement('tr');
        const cellNombre = document.createElement('td');
        const cellTipo = document.createElement('td');
        const cellAnio = document.createElement('td');

        const link = document.createElement('a');
        link.textContent = item.providencia;
        link.href = '#';
        link.onclick = () => abrirVentanaTexto(item.providencia);
        cellNombre.appendChild(link);

        cellTipo.textContent = item.tipo;
        cellAnio.textContent = item.anio;

        row.appendChild(cellNombre);
        row.appendChild(cellTipo);
        row.appendChild(cellAnio);
        tablaResultados.appendChild(row);
    });
}

async function buscarPorNombre() {
    const nombre = document.getElementById('inputNombre').value;
    const data = await fetchData(`http://localhost:3000/api/providencia/${nombre}`);
    renderTable([data]);
}

async function buscarPorTipo() {
    const tipo = document.getElementById('inputTipo').value;
    const data = await fetchData(`http://localhost:3000/api/tipo/${tipo}`);
    renderTable(data);
}

async function buscarPorAnio() {
    const anio = document.getElementById('selectAnio').value;
    if (anio) {
        const data = await fetchData(`http://localhost:3000/api/anio/${anio}`);
        renderTable(data);
    }
}

async function buscarPorTexto() {
    const query = document.getElementById('inputTexto').value;
    const data = await fetchData(`http://localhost:3000/api/texto?query=${query}`);
    renderTable(data);
}

document.getElementById('buscarNombre').onclick = buscarPorNombre;
document.getElementById('buscarTipo').onclick = buscarPorTipo;
document.getElementById('buscarAnio').onclick = buscarPorAnio;
document.getElementById('buscarTexto').onclick = buscarPorTexto;

document.getElementById('abrirSimilitud').onclick = () => {
    window.open('similitud.html', '_blank', 'width=800,height=600');
};

// Inicializar la carga de años al cargar la página
function cargarAnios() {
    const selectAnio = document.getElementById('selectAnio');
    selectAnio.innerHTML = '<option value="">Seleccione un año</option>';

    const currentYear = new Date().getFullYear();
    for (let year = 2005; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectAnio.appendChild(option);
    }
}
cargarAnios();
