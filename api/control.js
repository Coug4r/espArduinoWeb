import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const estadoLed = await redis.get('estado_led') ?? "OFF";
    return res.status(200).json({ led: estadoLed });
  }

  if (req.method === 'POST') {
    const { led } = req.body;
    if (led !== undefined) {
      await redis.set('estado_led', led);
      return res.status(200).json({ mensaje: "Guardado permanente", led });
    }
    return res.status(400).json({ error: "Falta el campo 'led'" });
  }

  return res.status(405).json({ error: "Método no permitido" });
}