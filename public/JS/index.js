document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Efecto de foco dinámico en los inputs
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('active');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('active');
            }
        });
    });

    // Manejo del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        // Mostrar estado de carga
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            const response = await fetch('/api/userAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) { // Si la respuesta HTTP es 2xx (éxito)
                const data = await response.json();
                if (data && data.session && data.user) {
                    console.log('Login exitoso:', data);
                    document.cookie = `access_token=${data.session.access_token}; path=/`
                    localStorage.setItem('access_token', data.session.access_token)
                    window.location.href = '/busqueda'
                } else {
                    // Esto debería ser raro si response.ok es true y el backend envía datos correctos
                    alert('Respuesta inesperada del servidor.');
                }
            } else { // Si la respuesta HTTP es un error (ej. 401, 500)
                const errorData = await response.json(); // Intentar leer el error del cuerpo
                if (response.status === 401) {
                    alert(errorData.error || 'Credenciales no encontradas.');
                } else if (response.status === 500) {
                    alert(errorData.error || 'Error interno del servidor. Por favor, inténtalo más tarde.');
                } else {
                    alert(`Error: ${response.status} - ${errorData.error || 'Ocurrió un error inesperado.'}`);
                }
            }
        } catch (error) {
            console.error('Error en el login (conexión/red):', error);
            alert('Error al conectar con el servidor. Por favor, verifica tu conexión o inténtalo más tarde.');
        } finally {
            // Quitar estado de carga
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });

    
});