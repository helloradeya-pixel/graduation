import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const hashData = (data: string) => {
  if (!data) return undefined;
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
};

const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  return cleaned;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const service = body.service || "unknown";
    const segment = body.segment || "graduation";
    const rawValue = Number(body.value || 0);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;
    
    const event_id = body.event_id; 
    const event_type = body.type || 'inquiry'; 
    const event_name = event_type === 'booking' ? 'Purchase' : 'Lead';

    const { ph, em, fbc, fbp, fn, ln } = body.user_data || {};

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          event_source_url: body.url || "https://radeyaphoto.com/",
           // TAMBAHKAN BARIS DI BAWAH INI:
          test_event_code: "TEST13400", 
          user_data: {
  client_user_agent: req.headers["user-agent"] || "",
  client_ip_address: (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "",
  ph: ph ? hashData(normalizePhone(ph)) : undefined,
  em: em ? hashData(em) : undefined,
  fn: fn ? hashData(fn) : undefined,
  ln: ln ? hashData(ln) : undefined,
  // Menambahkan external_id menggunakan hash email atau telepon untuk meningkatkan match quality
  external_id: em ? hashData(em) : (ph ? hashData(normalizePhone(ph)) : undefined),
  // Menggunakan undefined jika nilai null/kosong agar tidak dikirim ke Meta
  fbc: fbc || undefined,
  fbp: fbp || undefined,
},

          custom_data: {
            value,
            currency: "IDR",
            content_name: `Booking_${service}`,
            segment: segment,
            service: service,
            type: event_type,
          },
        },
      ],
    };

    let pixelTargetId = segment === 'frame' ? (process.env.PIXEL_FRAME_ID || '1413881487242621') : (process.env.PIXEL_GRADUATION_ID || '804715912719122');

    const response = await fetch(`https://graph.facebook.com/v20.0/${pixelTargetId}/events?access_token=${process.env.META_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return res.status(200).json({ success: true, meta_result: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
