// Logica de botones de navegacion
let currentTableindex = 0;
let IDArray = [];

function botonAdelante(){
    currentTableindex += 1;
    renderTableinArray();    
}

function botonAtras(){
    currentTableindex -= 1;
    renderTableinArray();
}

function renderTableinArray(){
    
    fetch(apiURls[currentTableindex][0] + IDArray[apiURls[currentTableindex][1]])
        .then(res => res.json())
        .then(data => {
            populateTable(table, data[0]);
        })
        .catch(err => {
            console.error(err);
        });
}
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
    option.innerText = opcion;
    const opcionEdit = opcion.replace(' ', '_');
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

    // fetch(api + inputNum)
    //     .then(res => res.json())
    //     .then(data => {
    //         populateTable(table, data[0]);
    //         //TODO: Ver como hacerle para acceder a apiURls[x][y] y si esto funciona
    //         return fetch('/api/front/getIDarray/'+inputNum+'/'+apiURls[selectValue][1])
    //     })
    //     .then(res => res.json()) 
    //     .then(array => {
    //         IDArray = array;
    //         console.warn(IDArray);
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });

    fetch(api + inputNum)
        .then(res => res.json())
        .then(data => {
            populateTable(table, data[0]);
            //TODO: Ver como hacerle para acceder a apiURls[x][y] y si esto funciona
            const jsonData = [
            {
                "id_cliente": 1001,
                "id_transporte": 4000,
                "id_lote": 2500,
                "id_seccion": 5000,
                "id_unidad": 4500,
                "id_actividad": 1500,
                "id_insumo": 2000
            }
            ];
            IDArray = jsonData[0];
            console.warn(IDArray);
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
        const header = document.createElement('tr');
        const title = document.createElement('th');
        const sinDatos = document.createElement('b');
        header.appendChild(title);
        title.appendChild(sinDatos);
        sinDatos.style.fontSize = '25px';
        sinDatos.innerText = 'No se encontro información';
        table.appendChild(header); 
    }
}