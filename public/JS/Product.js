let id = window.location.pathname.split('/')[2];
let idSeccion = 0;

const title = document.getElementById('titleContainer');
title.innerHTML = "ID PRODUCTO: " + id;

const readMoreBtn = document.getElementById('readMoreBtn');
if (readMoreBtn) {
    readMoreBtn.href = `http://localhost:3001/ProductInfo/${id}`;
}

// Tablas
const clienteFinalTable = document.getElementById('clienteFinalTable');
const embarqueTable = document.getElementById('embarqueTable');
const transporteTable = document.getElementById('transporteTable');
const lotCosechaTable = document.getElementById('lotCoseTable');
const seccionCultivoTable = document.getElementById('seccionCultivoTable');
const uniProductTable = document.getElementById('uniProductTable');
const bitActTable = document.getElementById('bitActTable');
const insumosTable = document.getElementById('insumosTable');
const proveedorTable = document.getElementById('proveedorTable');

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

function formatTitle(key) {
    return key
        .replace(/[-_.]/g, " ")
        .replace(/^\w/, c => c.toUpperCase());
}

function formatCellValue(key, value) {
    // Manejo de Booleanos (Lavado, Desinfección, etc.)
    if (typeof value === "boolean") {
        return value ? '<span class="check-icon">✓</span>' : '<span class="false-icon">-</span>';
    }
    
    // Si el valor es null o undefined
    if (value === null || value === undefined) return "";

    // Resaltado de IDs o códigos
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('id') || lowerKey.includes('codigo') || lowerKey.includes('lote')) {
        return `<span class="id-highlight">${value}</span>`;
    }

    return value;
}

function populateTable(table, data) {
    try {
        const rows = Array.isArray(data) ? data : [data];
        if (!data || (Array.isArray(data) && data.length === 0)) throw new Error("Sin datos");

        const flatRows = rows.map(row => flattenObject(row));
        const allKeys = [...new Set(flatRows.flatMap(row => Object.keys(row)))];
    
        const thead = document.createElement("thead");
        const titleRow = document.createElement("tr");
    
        allKeys.forEach(key => {
            const th = document.createElement("th");
            th.innerText = formatTitle(key);
            titleRow.appendChild(th);
        });
    
        thead.appendChild(titleRow);
        table.appendChild(thead);
    
        const tbody = document.createElement("tbody");
        flatRows.forEach(flatRow => {
            const tr = document.createElement("tr");
            allKeys.forEach(key => {
                const td = document.createElement("td");
                const value = flatRow[key];
                td.innerHTML = formatCellValue(key, value);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    } catch (error) {
        if (table && table.closest('.section-card')) {
            table.closest('.section-card').style.display = 'none'; // Ocultar sección si no hay datos
        }
    }
}

const endLoading = new CustomEvent("endLoad");
const loading = document.getElementById('loading');
document.addEventListener('endLoad', (e) => {
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 500);
});

// Cadena de Fetch
fetch("/api/logistica-envios/getClientesPorID/"+id)
    .then(res => res.json())
    .then(data => {
        if (!data[0]) throw new Error("Producto no encontrado");
        populateTable(clienteFinalTable, data[0]);
        const idCliente = data[0].id_cliente;
        return fetch("/api/logistica-envios/getEmbarquesPorID/" + idCliente);
    })
    .then(res => res.json())
    .then(data => {
        if (!data[0]) throw new Error("Embarque no encontrado");
        populateTable(embarqueTable, data);
        const idLote = data[0].id_lote;
        const idTransporte = data[0].id_transporte;

        // Fetch Transporte y Lote en paralelo
        return Promise.all([
            fetch("/api/logistica-envios/getTransportesPorID/" + idTransporte).then(res => res.json()),
            fetch("/api/logistica-envios/getLotePorID/" + idLote).then(res => res.json())
        ]);
    })
    .then(([transporteData, loteData]) => {
        populateTable(transporteTable, transporteData);
        populateTable(lotCosechaTable, loteData);

        if (!loteData[0]) throw new Error("Lote no encontrado");
        idSeccion = loteData[0].id_seccion;

        return fetch("/api/produccion/getSeccionCultivoPorID/" + idSeccion);
    })
    .then(res => res.json())
    .then(data => {
        if (!data[0]) throw new Error("Sección no encontrada");
        populateTable(seccionCultivoTable, data[0]);
        const idUnidad = data[0].id_unidad;

        return fetch("/api/up/getUnidadesPorID/"+idUnidad);
    })
    .then(res => res.json())
    .then(data => {
        populateTable(uniProductTable, data[0]);
        return fetch("/api/produccion/getBitacoraPorID/" + idSeccion);
    })
    .then(res => res.json())
    .then(data => {
        populateTable(bitActTable, data);
        
        if (data && data.length > 0) {
            // Tomamos la primera actividad para buscar insumos (o podríamos iterar, pero por ahora simplificamos)
            const idActividad = data[0].id_actividad;
            return fetch("/api/insumos/getInsumosPorID/" + idActividad);
        }
        return [];
    })
    .then(res => {
        if (Array.isArray(res)) return res;
        return res.json();
    })
    .then(data => {
        populateTable(insumosTable, data);
        if (data && data.length > 0) {
            const idInsumo = data[0].id_insumo;
            return fetch("/api/logistica-insumos/getInfoProvePorID/" + idInsumo);
        }
        return [];
    })
    .then(res => {
        if (Array.isArray(res)) return res;
        return res.json();
    })
    .then(data => {
        populateTable(proveedorTable, data);
        document.dispatchEvent(endLoading);
    })
    .catch(error => {
        console.error(error);
        const container = document.getElementById('tablasContainer');
        container.innerHTML = `
            <div class="section-card" style="text-align: center; padding: 4rem;">
                <h2 style="justify-content: center; margin-bottom: 1rem;">Error de Trazabilidad</h2>
                <p style="color: var(--text-secondary)">No se pudo recuperar la información para el ID: ${id}. Verifique que el código sea correcto.</p>
            </div>
        `;
        document.dispatchEvent(endLoading);
    });
