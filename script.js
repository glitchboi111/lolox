async function capturarYEnviar() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // Dibujar el frame en un canvas invisible
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Convertir a imagen (base64)
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Enviar a tu API de Vercel
    await fetch('/api/upload-photo', {
        method: 'POST',
        body: JSON.stringify({ image: dataUrl })
    });
}