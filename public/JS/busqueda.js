//Poblar menu select
const table = document.getElementById('resultsTable');
const opciones = [
    "cliente final",
    "Embarque", 
    "Transporte",
    "Lote de cosecha",
    "Seccion de cultivo",
    "Unidad de produccion",
    "Bitacora de actividades",
    "Aplicacion de insumos",
    "Proveedor",
];
const apiURls = {
    "cliente_final":"/api/logistica-envios/getClientesPorID/",
    "Embarque":"/api/logistica-envios/getEmbarquesPorID/", 
    "Transporte":"/api/logistica-envios/getTransportesPorID/",
    "Lote_de_cosecha":"/api/logistica-envios/getLotePorID/",
    "Seccion_de_cultivo":"/api/produccion/getSeccionCultivoPorID/",
    "Unidad_de_produccion":"/api/up/getUnidadesPorID/",
    "Bitacora_de_actividades":"/api/produccion/getBitacoraPorID/",
    "Aplicacion_de_insumos":"/api/insumos/getInsumosPorID/",
    "Proveedor":"/api/logistica-insumos/getInfoProvePorID/",
}
const apiIDs = {
    "cliente_final":"id_cliente",
    "Embarque":"id_cliente", 
    "Transporte":"id_transporte",
    "Lote_de_cosecha":"id_lote",
    "Seccion_de_cultivo":"id_seccion",
    "Unidad_de_produccion":"id_unidad",
    "Bitacora_de_actividades":"id_seccion",
    "Aplicacion_de_insumos":"id_actividad",
    "Proveedor":"id_insumo",
}

const menuSelect = document.getElementById('filtroSelect');
menuSelect.innerHTML = '<option value=""> Buscar por </option>';
opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.innerText = opcion;
    const opcionEdit = opcion.replace(' ','_');
    option.value = opcionEdit;
    menuSelect.appendChild(option);
});

function handleSearch(e) {
    table.innerHTML = '';
    const selectValue = document.getElementById('filtroSelect').value;
    const inputNum = document.getElementById('busqueda').value;
    const api = apiURls[selectValue];
    fetch(api + inputNum)
    .then(res => res.json())
    .then(data => {
        populateTable(table, data[0]);
    })
    .catch(err => {
        console.error(err);
    });
  }
  
//----------------------------------- Funciones para poblar la tabla con datos ---------------------------------------
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