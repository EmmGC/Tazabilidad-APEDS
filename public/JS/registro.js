const formSelector = document.getElementById('formSelector');
const formContainer = document.getElementById('formContainer');
const formFields = document.getElementById('formFields');
const dynamicForm = document.getElementById('dynamicForm');

// Función para obtener el token de las cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Configuración de los formularios SINCRONIZADA con db_scrip.txt
const formsConfig = {
    proveedores: {
        endpoint: "/api/logistica-insumos/proveedores",
        fields: [
            { label: "Nombre de la Empresa", name: "nombre_empresa", type: "text", required: true },
            { label: "Contacto de Ventas", name: "contacto_ventas", type: "text" },
            { label: "Correo de Contacto", name: "correo_contacto", type: "email", required: true },
            { label: "Teléfono", name: "telefono", type: "tel" },
            { label: "Dirección", name: "direccion", type: "text" }
        ]
    },
    insumos_agricolas: {
        endpoint: "/api/insumos/",
        fields: [
            { label: "Nombre Comercial", name: "nombre_comercial", type: "text", required: true },
            { label: "Ingrediente Activo", name: "ingrediente_activo", type: "text", required: true },
            { label: "Formulación", name: "formulacion", type: "text" },
            { label: "Presentación", name: "presentacion", type: "text" },
            { label: "Registro COFEPRIS", name: "registro_cofepris", type: "text", required: true }
        ]
    },
    unidades_produccion: {
        endpoint: "/api/up/unidades",
        fields: [
            { label: "Nombre de la Unidad", name: "nombre_unidad", type: "text", required: true },
            { label: "País", name: "pais", type: "text", placeholder: "México" },
            { label: "Estado", name: "estado", type: "text" },
            { label: "Municipio", name: "municipio", type: "text" },
            { label: "Código Postal", name: "codigo_postal", type: "text" },
            { label: "Dirección del Predio", name: "direccion_predio", type: "text" },
            { label: "Latitud", name: "latitud", type: "number", step: "any" },
            { label: "Longitud", name: "longitud", type: "number", step: "any" },
            { label: "Certificaciones", name: "certificaciones", type: "text" },
            { label: "Código Estado (INEGI)", name: "codigo_estado", type: "text", required: true },
            { label: "Código Municipio (INEGI)", name: "codigo_municipio", type: "text", required: true },
            { label: "Número UP", name: "numero_up", type: "text", required: true }
        ]
    },
    secciones_cultivo: {
        endpoint: "/api/up/secciones",
        fields: [
            { label: "ID Unidad", name: "id_unidad", type: "number", required: true },
            { label: "Nombre de la Sección", name: "nombre_seccion", type: "text", required: true },
            { label: "Cultivo", name: "cultivo", type: "text" },
            { label: "Variedad", name: "variedad", type: "text" },
            { label: "Superficie (Hectáreas)", name: "superficie_hectareas", type: "number", step: "0.01" },
            { label: "Fecha de Siembra", name: "fecha_siembra", type: "date" },
            { label: "Fecha Estimada Cosecha", name: "fecha_estimada_cosecha", type: "date" },
            { label: "Código Sección", name: "codigo_seccion", type: "text", required: true },
            { label: "Código Cultivo", name: "codigo_cultivo", type: "text", required: true },
            { label: "Código Variedad", name: "codigo_variedad", type: "text", required: true }
        ]
    },
    clientes_destinos: {
        endpoint: "/api/logistica-envios/clientes",
        fields: [
            { label: "Nombre de la Empresa", name: "nombre_empresa", type: "text", required: true },
            { label: "Representante Legal", name: "representante_legal", type: "text" },
            { label: "País", name: "pais", type: "text" },
            { label: "Estado", name: "estado", type: "text" },
            { label: "Municipio", name: "municipio", type: "text" },
            { label: "Dirección", name: "direccion", type: "text" },
            { label: "Teléfono", name: "telefono", type: "tel" },
            { label: "Correo Electrónico", name: "correo_electronico", type: "email" },
            { label: "Marca Comercial", name: "marca_comercial", type: "text" },
            { label: "Mercado Destino", name: "mercado_destino", type: "text" }
        ]
    },
    transportes: {
        endpoint: "/api/logistica-envios/transportes",
        fields: [
            { label: "Tipo de Vehículo", name: "tipo_vehiculo", type: "text", required: true },
            { label: "Placas", name: "placas", type: "text", required: true },
            { label: "Capacidad (kg)", name: "capacidad_kg", type: "number", step: "0.01" },
            { label: "Capacidad (cajas)", name: "capacidad_cajas", type: "number" },
            { label: "Temperatura Mínima", name: "temperatura_min", type: "number", step: "0.1" },
            { label: "Temperatura Máxima", name: "temperatura_max", type: "number", step: "0.1" },
            { label: "Propietario", name: "propietario", type: "text" },
            { label: "Certificado Sanitario", name: "certificado_sanitario", type: "select", options: ["True", "False"] },
            { label: "Responsable Asignado", name: "responsable_asignado", type: "text" }
        ]
    }
};

// Escuchar cambios en el selector
formSelector.addEventListener('change', (e) => {
    const selectedForm = e.target.value;
    if (selectedForm && formsConfig[selectedForm]) {
        generateForm(formsConfig[selectedForm]);
        formContainer.style.display = 'block';
    }
});

function generateForm(config) {
    formFields.innerHTML = '';
    config.fields.forEach(field => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'form-field';
        const label = document.createElement('label');
        label.innerText = field.label;
        label.setAttribute('for', field.name);
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.toLowerCase();
                option.innerText = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            if (field.step) input.step = field.step;
            if (field.placeholder) input.placeholder = field.placeholder;
        }
        
        input.name = field.name;
        input.id = field.name;
        if (field.required) input.required = true;
        
        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        formFields.appendChild(fieldDiv);
    });
}

// Manejar el envío del formulario a la API
dynamicForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedKey = formSelector.value;
    const config = formsConfig[selectedKey];
    const formData = new FormData(dynamicForm);
    const data = Object.fromEntries(formData.entries());
    
    // CONVERSIÓN DE TIPOS DE DATOS (Vital para Supabase)
    const numericFields = [
        'id_unidad', 'superficie_hectareas', 'capacidad_kg', 'capacidad_cajas',
        'latitud', 'longitud', 'temperatura_min', 'temperatura_max'
    ];

    Object.keys(data).forEach(key => {
        // Convertir a número si es un campo numérico y no está vacío
        if (numericFields.includes(key) && data[key] !== "") {
            data[key] = Number(data[key]);
        }
        // Convertir a booleano si es el campo de certificado sanitario
        if (key === 'certificado_sanitario') {
            data[key] = data[key] === "true";
        }
        // Eliminar campos vacíos que no son obligatorios para evitar errores de tipo en la DB
        if (data[key] === "" && !config.fields.find(f => f.name === key).required) {
            delete data[key];
        }
    });

    // Obtener el token de acceso desde las cookies
    const token = getCookie('access_token');

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.mensaje || 'Registro guardado con éxito');
            dynamicForm.reset();
            formContainer.style.display = 'none';
            formSelector.value = "";
        } else {
            alert('Error: ' + (result.error || 'No se pudo guardar el registro'));
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('Error de conexión con el servidor');
    }
});
