let id = window.location.pathname.split('/')[1];
let idTransporte = 0;
let idSeccion = 0;

const title = document.getElementById('titleContainer');
title.innerHTML = "Informacion del producto " + id;
//Tablas en el documento
const clienteTable = document.getElementById('clienteTable');
const embarqueTable = document.getElementById('embarqueTable');
const transporteTable = document.getElementById('transporteTable');
const lotCosechaTable = document.getElementById('lotCoseTable');
const seccionCultivoTable = document.getElementById('seccionCultivoTable');
const uniProductTable = document.getElementById('uniProductTable');
const bitActTable = document.getElementById('bitActTable');
const detAplicInsumosTable = document.getElementById('detAplicInsumosTable');
const insumosAgricTable = document.getElementById('insumosAgricTable');
const recepInsumosTable = document.getElementById('recepInsumosTable');
const proveedoresTable = document.getElementById('proveedoresTable');

function populateTable(table, data) {
    const titulos = Object.keys(data);

    // Valores de Key para titulos de columnas
    const thead = document.createElement("thead");
    const titleRow = document.createElement("tr");
    thead.appendChild(titleRow);
    table.appendChild(thead);

    titulos.forEach(titulo => {
        titulo = titulo.replace(/[-_]/g, " ");
        titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
        const cell = document.createElement("th"); 
        cell.innerText = titulo;
        titleRow.appendChild(cell);
    });

    // Randerizar datos
    const tbody = document.createElement("tbody");
    const dataRow = document.createElement("tr");
    tbody.appendChild(dataRow);
    table.appendChild(tbody);

    Object.values(data).forEach(dato => {
        const cell = document.createElement("td");
        cell.innerText = dato;
        dataRow.appendChild(cell);
    });
}

fetch("/api/logistica-envios/getClientesPorID/"+id)
    .then(res => res.json())
    .then(data => {
        id = data[0].id_cliente;
        populateTable(clienteTable, data[0]);
        
        return fetch("/api/logistica-envios/getEmbarquesPorID/" + id);
    })
    .then(res => res.json())
    .then(data => {
        id = data[0].id_lote;
        idTransporte = data[0].id_transporte;
        populateTable(embarqueTable, data[0]);

        // ✅ Second fetch goes HERE, now idTransporte is guaranteed to exist
        return fetch("/api/logistica-envios/getTransportesPorID/" + idTransporte);
    })
    .then(res => res.json())
    .then(data => {
        populateTable(transporteTable, data[0]);

        return fetch("/api/logistica-envios/getLotePorID/" + id);
    })
    .then(res => res.json())
    .then(data => {
        idSeccion = data[0].id_seccion;
        populateTable(lotCosechaTable, data[0]);

        return fetch("/api/produccion/getSeccionCultivoPorID/" + idSeccion);
    })
    .then(res => res.json())
    .then(data => {
        id = data[0].id_unidad;
        populateTable(seccionCultivoTable, data[0]);

        return fetch("/api/up/getUnidadesPorID/"+id);
    })
    .then(res => res.json())
    .then(data => {
        populateTable(uniProductTable, data[0]);

        return fetch("/api/produccion/getBitacoraPorID/" + idSeccion);
    })
    .then(res => res.json())
    .then(data => {
        id = data[0].id_actividad;
        populateTable(bitActTable, data[0]);

        //return fetch("/api/produccion/getBitacoraPorID/"+id);
    })
    .catch(error => {
        console.error(error);
    });
