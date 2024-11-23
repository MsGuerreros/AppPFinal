async function fetchSimilitudes(nombre, minSimilitud) {
    try {
        const response = await fetch(`http://localhost:3001/api/similitud/${nombre}?minSimilitud=${minSimilitud}`);
        if (!response.ok) {
            throw new Error('Error al obtener las similitudes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las similitudes:', error.message);
        return [];
    }
}

function renderGrafo(similitudes, providencia) {
    const svg = d3.select('#grafo');
    svg.selectAll('*').remove(); // Limpia el grafo

    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const nodes = [{ id: providencia }];
    const links = [];

    similitudes.forEach(sim => {
        nodes.push({ id: sim.providencia2 });
        links.push({ source: providencia, target: sim.providencia2 });
    });

    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', 1.5);

    const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', (d, i) => (i === 0 ? 'red' : 'blue'))
        .call(drag(simulation));

    // Añadir nombres de las providencias cerca de los nodos
    const labels = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('font-size', 12)
        .attr('dx', 12) // Ajuste horizontal de la etiqueta respecto al nodo
        .attr('dy', 4) // Ajuste vertical de la etiqueta respecto al nodo
        .text(d => d.id);

    simulation.nodes(nodes).on('tick', () => {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x).attr('cy', d => d.y);
        labels.attr('x', d => d.x).attr('y', d => d.y);
    });

    simulation.force('link').links(links);

    function drag(simulation) {
        return d3.drag()
            .on('start', event => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            })
            .on('drag', event => {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            })
            .on('end', event => {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            });
    }
}

function renderSimilitudes(similitudes) {
    const lista = document.getElementById('similitudLista');
    lista.innerHTML = '';
    similitudes.forEach(sim => {
        const item = document.createElement('li');
        item.textContent = `${sim.providencia2}: ${sim.similitud.toFixed(2)}`;
        lista.appendChild(item);
    });
}

document.getElementById('buscarSimilitud').addEventListener('click', async () => {
    const nombre = document.getElementById('inputSimilitud').value;
    const minSimilitud = parseFloat(document.getElementById('inputMinSimilitud').value) || 0;

    if (!nombre) {
        alert('Por favor, ingrese el nombre de la providencia.');
        return;
    }

    const similitudes = await fetchSimilitudes(nombre, minSimilitud);

    const resultadoSimilitud = document.getElementById('resultadoSimilitud');
    resultadoSimilitud.textContent = `Se encontraron ${similitudes.length} similitudes para la providencia "${nombre}" con umbral ${minSimilitud}.`;

    renderGrafo(similitudes, nombre);
    renderSimilitudes(similitudes);
});
