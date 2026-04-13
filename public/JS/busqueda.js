// Logica de botones de navegacion
let currentTableindex = 0;
let IDArray = [];
const botonAdelante = document.getElementById('btnNext');
const botonAtras = document.getElementById('btnPrev');
const title = document.getElementById('actualTable');
const table = document.getElementById('resultsTable');
let resultLength = 0;
function irAdelante(btn){
    currentTableindex += 1;
    botonAtras.disabled = false;
    if(currentTableindex === resultLength){
        btn.disabled = true;
    }
    renderTableinArray();    
}

function irAtras(btn){
    currentTableindex -= 1;
    botonAdelante.disabled = false;
    if(currentTableindex === 0){
        btn.disabled = true;
    }
    renderTableinArray();
}

function renderTableinArray(){
    nextTableID = IDArray[0][apiURls[opciones[currentTableindex]][1]];
    if(nextTableID !== null){
        fetch(apiURls[opciones[currentTableindex]][0] + nextTableID)
            .then(res => res.json())
            .then(data => {
                populateTableAndTitle(table, data[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }else{
        table.innerHTML = '';
        title.innerText = 'Tabla actual: ' + opciones[currentTableindex].replaceAll('_',' ');
        const header = document.createElement('tr');
        const tableHead = document.createElement('th');
        const sinDatos = document.createElement('b');
        header.appendChild(tableHead);
        tableHead.appendChild(sinDatos);
        sinDatos.style.fontSize = '25px';
        sinDatos.innerText = 'Sin registro';
        table.appendChild(header); 
    }
}

//Poblar menu select

const opciones = [
    "cliente_final",
    "Embarque",
    "Transporte",
    "Lote_de_cosecha",
    "Seccion_de_cultivo",
    "Unidad_de_produccion",
    "Bitacora_de_actividades",
    "Aplicacion_de_insumos",
    "Proveedor",
];
const apiURls = {
    "cliente_final": ["/api/logistica-envios/getClientesPorID/", "id_cliente"],
    "Embarque": ["/api/logistica-envios/getEmbarquesPorID/", "id_cliente"],
    "Transporte": ["/api/logistica-envios/getTransportesPorID/", "id_transporte"],
    "Lote_de_cosecha": ["/api/logistica-envios/getLotePorID/", "id_lote"],
    "Seccion_de_cultivo": ["/api/produccion/getSeccionCultivoPorID/", "id_seccion"],
    "Unidad_de_produccion": ["/api/up/getUnidadesPorID/", "id_unidad"],
    "Bitacora_de_actividades": ["/api/produccion/getBitacoraPorID/", "id_seccion"],
    "Aplicacion_de_insumos": ["/api/insumos/getInsumosPorID/", "id_actividad"],
    "Proveedor": ["/api/logistica-insumos/getInfoProvePorID/", "id_insumo"],
}

const menuSelect = document.getElementById('filtroSelect');
menuSelect.innerHTML = '<option value=""> Buscar por </option>';
opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.innerText = opcion.replaceAll('_', ' ');
    const opcionEdit = opcion;
    option.value = opcionEdit;
    menuSelect.appendChild(option);
});

function handleSearch(e) {
    e.preventDefault();
    table.innerHTML = '';
    const selectValue = document.getElementById('filtroSelect').value;
    const inputNum = document.getElementById('busqueda').value;
    const api = apiURls[selectValue][0];
    currentTableindex = opciones.indexOf(selectValue);
    if(currentTableindex < 0) currentTableindex = 0;
    fetch(api + inputNum)
        .then(res => res.json())
        .then(data => {
            populateTableAndTitle(table, data[0]);
            return fetch('/api/front/getIDarray/'+inputNum+'/'+apiURls[selectValue][1])
        })
        .then(res => res.json()) 
        .then(array => {
            console.log(array);
            IDArray = array;
            resultLength = Object.keys(IDArray[0]).length;
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

function populateTableAndTitle(table, data) {
    try {
        botonAdelante.disabled = false;
        botonAtras.disabled = false;
        if(currentTableindex === 0){
            botonAtras.disabled = true;
        }else if (currentTableindex === resultLength) {
            botonAdelante.disabled = true;
        }
        title.innerText = 'Tabla actual: ' + opciones[currentTableindex].replaceAll('_',' ');
        table.innerHTML = '';
        if (data === undefined || data === null){
            throw new Error();
        }
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
        title.innerText = '';
        const header = document.createElement('tr');
        const tableHead = document.createElement('th');
        const sinDatos = document.createElement('b');
        botonAdelante.disabled = true;
        botonAtras.disabled = true;
        header.appendChild(tableHead);
        tableHead.appendChild(sinDatos);
        sinDatos.style.fontSize = '25px';
        sinDatos.innerText = 'No se encontro información';
        table.appendChild(header); 
    }
}