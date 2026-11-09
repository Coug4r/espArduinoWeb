import { Redis } from '@upstash/redis';

// Respaldo en memoria por si las variables de entorno aún no cargan
let memoriaLed = "OFF";

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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    // 1. Petición GET (ESP8266 / Navegador)
    if (req.method === 'GET') {
      if (redis) {
        const estadoLed = await redis.get('estado_led') ?? "OFF";
        return res.status(200).json({ led: estadoLed });
      }
      // Si Redis no tiene variables aún, responde desde memoria sin fallar
      return res.status(200).json({ led: memoriaLed });
    }

    // 2. Petición POST (Postman)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { led } = body;

      if (led !== undefined) {
        memoriaLed = String(led);
        if (redis) {
          await redis.set('estado_led', memoriaLed);
        }
        return res.status(200).json({ 
          mensaje: redis ? "Guardado en Upstash Redis" : "Guardado en memoria (Faltan env vars de Redis)", 
          led: memoriaLed 
        });
      }
      return res.status(400).json({ error: "Falta el campo 'led'" });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res.status(500).json({ error_detalle: err.message });
  }
}