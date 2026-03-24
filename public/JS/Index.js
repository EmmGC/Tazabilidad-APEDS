const id = window.location.pathname.split('/')[1];
console.log(id)

const title = document.getElementById('titleContainer');
title.innerHTML = "Informacion del producto " + id;
//Tablas en el documento
const clienteTable = document.getElementById('clienteTable');
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

const testJson = [{
    "id_unidad": 5,
    "nombre_unidad": "Finca El Sol",
    "pais": "México",
    "estado": "Puebla",
    "municipio": "Atlixco",
    "codigo_postal": "74200",
    "direccion_predio": "Carretera 1 Sur",
    "latitud": null,
    "longitud": null,
    "certificaciones": null,
    "codigo_estado": "21",
    "codigo_municipio": "114",
    "numero_up": "01"
  }]

populateTable(proveedoresTable, testJson[0]);