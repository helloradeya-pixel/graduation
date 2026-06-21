import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Fungsi untuk Hashing SHA-256 (Standar Meta Advanced Matching)
const hashData = (data: string) => {
  if (!data) return undefined;
  const cleaned = data.replace(/\D/g, "");
  return crypto.createHash("sha256").update(cleaned).digest("hex");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    // =========================
    // DATA & LOGIKA KOREKSI HARGA
    // =========================
    const service = body.service || "unknown";
    const rawValue = Number(body.value || 0);
    // Jika input di bawah 5000, anggap input singkat (misal 200 = 200rb)
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;
    
    const event_id = body.event_id || `${service}_${Date.now()}`;
    const segment = body.segment || service;
    const event_type = body.type || 'inquiry'; 
    const event_name = event_type === 'booking' ? 'Purchase' : 'Lead';

    // Hashing nomor WA untuk Advanced Matching
    const phone = body.user_data?.ph || "";
    const hashedPhone = phone ? hashData(phone) : undefined;

    console.log(`🔥 CAPI HIT [v20.0] | Event: ${event_name} | Value: ${value}`);

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          user_data: {
            client_user_agent: req.headers["user-agent"] || "",
            ph: hashedPhone, // Data yang sudah di-hash
          },
          custom_data: {
            value,
            currency: "IDR",
            content_name: `${event_name}_${segment}`,
            segment: segment,
            service,
            type: event_type,
          },
        },
      ],
    };

    // =========================
    // SEND TO META (v20.0)
    // =========================
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.PIXEL_ID}/events?access_token=${process.env.META_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    return res.status(200).json({
      success: true,
      debug: { event_name, event_id, service, hashed: !!hashedPhone },
      meta: result,
    });

  } catch (error: any) {
    console.log("🔥 CAPI ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
