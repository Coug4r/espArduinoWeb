import { Redis } from '@upstash/redis';

// Soporta tanto el prefijo KV_ (el que creó Vercel en tu cuenta) como UPSTASH_
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const estadoLed = await redis.get('estado_led') ?? "OFF";
      return res.status(200).json({ led: estadoLed });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { led } = body;

      if (led !== undefined) {
        await redis.set('estado_led', String(led));
        return res.status(200).json({ mensaje: "Guardado permanente en Upstash", led });
      }
      return res.status(400).json({ error: "Falta el campo 'led'" });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    // Si algo falla, te imprimirá la causa exacta en pantalla en vez de la pantalla negra 500
    return res.status(500).json({ error_detalle: err.message });
  }
}