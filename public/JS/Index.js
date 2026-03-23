const id = window.location.pathname.split('/')[1];
console.log(id)

const title = document.getElementById('titleContainer');
title.innerHTML = "Informacion del producto " + id;
const tbody = document.getElementById('Mytable');

fetch('/api/produccion/getLotes')
    .then(res => res.json())
    .then(data => {
        data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${entry.id_lote}</td>
        <td>${entry.id_seccion}</td>
        <td>${entry.fecha_cosecha}</td>
        <td>${entry.cantidad_cajas}</td>
        <td>${entry.peso_kg}</td>
        <td>${entry.uso_cultivo}</td>
        <td>${entry.calidad}</td>
        <td>${entry.observaciones_calidad}</td>
        <td>${entry.calibre}</td>
        <td>${entry.codigo_trazabilidad}</td>
    `;
    tbody.appendChild(row);
    });
    });