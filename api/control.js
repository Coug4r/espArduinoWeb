import { Redis } from '@upstash/redis';

// Auto-detectar las variables de Upstash sin importar qué prefijo les puso Vercel
const envKeys = Object.keys(process.env);
const urlKey = envKeys.find(k => k.endsWith('REST_API_URL') || k.endsWith('REDIS_REST_URL'));
const tokenKey = envKeys.find(k => k.endsWith('REST_API_TOKEN') || k.endsWith('REDIS_REST_TOKEN'));

const redisUrl = urlKey ? process.env[urlKey] : null;
const redisToken = tokenKey ? process.env[tokenKey] : null;

// Solo inicializa Redis si encontró una URL válida que empiece con https://
const redis = (redisUrl && redisUrl.startsWith('http') && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

let dispositivos = {
  led: "OFF",
  motor: "0"
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    // 1. Petición GET (ESP8266 / Navegador)
    if (req.method === 'GET') {
      if (redis) {
        const guardado = await redis.get('dispositivos');
        if(guardado) dispositivos = guardado;
      }
      return res.status(200).json(dispositivos);
      // Si Redis no tiene variables aún, responde desde memoria sin fallar
      return res.status(200).json({ led: memoriaLed });
    }

    // 2. Petición POST (Postman)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if(redis){
        const guardado = await redis.get('dispositivos');
        if(guardado) dispositivos = guardados

        if(body.led !== undefined) dispositivos.led = body.led
        if(body.motor !== undefined) dispositivos.motor = body.motor 
      }

      if(redis){
        await redis.set('dispositivos', dispositivos);
      }

      return res.status(200).json({
        mensage: "Datos actualizados",
        datos: dispositivos
      })
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res.status(500).json({ error_detalle: err.message });
  }
}