// src/ping.ts
import { supabase } from './config/supabaseClient'; 

async function probar() {
    console.log("-------------> Intentando conectar con Supabase....................");
    
    try {
        const { data, error } = await supabase
            .from('perfiles_usuarios')
            .select('*')
            .limit(1);

        if (error) {
            console.error("Error de Supabase:", error.message);
            return;
        }

        console.log("|---Conexión establecida--|");
        console.log("Registros encontrados:", data.length);
    } catch (err) {
        console.error(" Error inesperado:", err);
    }
}

export default probar;
// ESTA LÍNEA ES LA QUE HACE QUE TODO CORRA:
probar();