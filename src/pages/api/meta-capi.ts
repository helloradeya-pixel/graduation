import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Fungsi Hashing SHA-256
const hashData = (data: string) => {
  if (!data) return undefined;
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
};

// Fungsi Normalisasi WhatsApp
const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  return cleaned;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    // 1. DATA INPUT
    const service = body.service || "unknown";
    const segment = body.segment || service;
    const rawValue = Number(body.value || 0);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;
    
    const event_id = body.event_id || `${service}_${Date.now()}`;
    const event_type = body.type || 'inquiry'; 
    const event_name = event_type === 'booking' ? 'Purchase' : 'Lead';

    // 2. ADVANCED MATCHING (Hashed Data)
    const phone = body.user_data?.ph || "";
    const email = body.user_data?.em || "";
    const fbc = body.user_data?.fbc || undefined;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          user_data: {
            client_user_agent: req.headers["user-agent"] || "",
            client_ip_address: (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "",
            ph: phone ? hashData(normalizePhone(phone)) : undefined,
            em: email ? hashData(email) : undefined,
            fbc: fbc,
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

    // 3. LOGIKA PENGIRIMAN PIXEL (Sesuai Kategori)
    // Jika frame, kirim ke Pixel Frame. Jika graduation/couple, kirim ke Pixel Utama.
    let pixelTargetIds: string[] = [];
    if (segment === 'frame') {
      pixelTargetIds = ['1413881487242621'];
    } else {
      pixelTargetIds = [process.env.PIXEL_ID || '804715912719122'];
    }

    console.log(`🔥 CAPI HIT | Event: ${event_name} | Target: ${pixelTargetIds.join(', ')}`);

    const results = await Promise.all(
      pixelTargetIds.map(async (pixelId) => {
        const response = await fetch(
          `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${process.env.META_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        return { pixelId, data };
      })
    );

    return res.status(200).json({ success: true, meta_results: results });

  } catch (error: any) {
    console.error("🔥 CAPI ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
