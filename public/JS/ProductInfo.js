let id = window.location.pathname.split('/')[2];
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

// Recursively flattens a nested object into dot-notation keys
// e.g. { insumos_agricolas: { nombre_comercial: "X" } } → { "insumos_agricolas.nombre_comercial": "X" }
function flattenObject(obj, prefix = "") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, fullKey));
        } else {
            acc[fullKey] = value;
        }

        return acc;
    }, {});
}

// Formats a key into a readable column title
// e.g. "insumos_agricolas.nombre_comercial" → "Insumos agricolas nombre comercial"
function formatTitle(key) {
    return key
        .replace(/[-_.]/g, " ")
        .replace(/^\w/, c => c.toUpperCase());
}

function populateTable(table, data) {
    try {
        // Normalize: accept both a single object and an array of objects
        const rows = Array.isArray(data) ? data : [data];
    
        // Flatten every row and collect all unique keys across all rows
        const flatRows = rows.map(row => flattenObject(row));
        const allKeys = [...new Set(flatRows.flatMap(row => Object.keys(row)))];
    
        // Build <thead>
        const thead = document.createElement("thead");
        const titleRow = document.createElement("tr");
    
        allKeys.forEach(key => {
            const th = document.createElement("th");
            th.innerText = formatTitle(key);
            titleRow.appendChild(th);
        });
    
        thead.appendChild(titleRow);
        table.appendChild(thead);
    
        // Build <tbody> — one <tr> per record
        const tbody = document.createElement("tbody");
    
        flatRows.forEach(flatRow => {
            const tr = document.createElement("tr");
    
            allKeys.forEach(key => {
                const td = document.createElement("td");
                const value = flatRow[key];
                td.innerText = value === null || value === undefined ? "" : value;
                tr.appendChild(td);
            });
    
            tbody.appendChild(tr);
        });
    
        table.appendChild(tbody);
    } catch (error) {
        const sinDatos = document.createElement('b');
        sinDatos.innerText = 'No se encontro información';
    }
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

        return fetch("/api/insumos/getInsumosPorID/"+id);
    })
    .then(res => res.json())
    .then(data => {
        id = data[0].id_insumo;
        populateTable(detAplicInsumosTable, data[0]);

        return fetch('/api/logistica-insumos/getInfoProvePorID/'+id);
    })
    .then(res => res.json())
    .then(data => {
        populateTable(recepInsumosTable, data[0]);
    })
    .catch(error => {
        console.error(error);
        const container = document.getElementById('tablasContainer');
        container.innerHTML = '<p>Ocurrio un error</p>';
    });
