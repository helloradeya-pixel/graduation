import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Fungsi Hashing SHA-256 (Standar Meta Advanced Matching)
const hashData = (data: string) => {
  if (!data) return undefined;
  return crypto.createHash("sha256").update(data).digest("hex");
};

// Fungsi Normalisasi
const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("08")) cleaned = "62" + cleaned.substring(1);
  return cleaned;
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
    // DATA & LOGIKA
    // =========================
    const service = body.service || "unknown";
    const rawValue = Number(body.value || 0);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;
    
    const event_id = body.event_id || `${service}_${Date.now()}`;
    const segment = body.segment || service;
    const event_type = body.type || 'inquiry'; 
    const event_name = event_type === 'booking' ? 'Purchase' : 'Lead';

    // Pengolahan Data Pelanggan (Advanced Matching)
    const phone = body.user_data?.ph || "";
    const email = body.user_data?.em || "";
    const firstName = body.user_data?.fn || "";
    const lastName = body.user_data?.ln || "";
    const zip = body.user_data?.zp || "";
    const fbc = body.user_data?.fbc || undefined;

    const hashedPhone = phone ? hashData(normalizePhone(phone)) : undefined;
    const hashedEmail = email ? hashData(email.toLowerCase().trim()) : undefined;
    const hashedFirstName = firstName ? hashData(firstName.toLowerCase().trim()) : undefined;
    const hashedLastName = lastName ? hashData(lastName.toLowerCase().trim()) : undefined;
    const hashedZip = zip ? hashData(zip.trim()) : undefined;
    
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || 
                     req.socket.remoteAddress || "";

    console.log(`🔥 CAPI HIT [v20.0] | Event: ${event_name} | Phone: ${!!hashedPhone} | Email: ${!!hashedEmail}`);

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          user_data: {
            client_user_agent: req.headers["user-agent"] || "",
            client_ip_address: clientIp,
            ph: hashedPhone,
            em: hashedEmail,
            fn: hashedFirstName,
            ln: hashedLastName,
            zp: hashedZip,
            fbc: fbc,
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
    // SEND TO META
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
      debug: { event_name, event_id, hashedPhone: !!hashedPhone, hashedEmail: !!hashedEmail, fbc: !!fbc },
      meta: result,
    });

  } catch (error: any) {
    console.log("🔥 CAPI ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
