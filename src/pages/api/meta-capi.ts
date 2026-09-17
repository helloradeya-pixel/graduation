import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const hashData = (data?: string) => {
  if (!data || typeof data !== "string") return undefined;
  const cleaned = data.trim().toLowerCase();
  if (!cleaned) return undefined;
  return crypto.createHash("sha256").update(cleaned).digest("hex");
};

const normalizePhone = (phone?: string) => {
  if (!phone) return undefined;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const service = body.service || "unknown";
    const segment = body.segment || "graduation";
    const rawValue = Number(body.value || 0);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;
    
    const event_id = body.event_id; 
    const event_type = body.type || "inquiry"; 
    const event_name = event_type === "booking" ? "Purchase" : "Lead";

    const { ph, em, fbc, fbp, fn, ln } = body.user_data || {};

    // Normalisasi dan hash data pengguna
    const formattedPhone = normalizePhone(ph);
    const hashedPhone = hashData(formattedPhone);
    const hashedEmail = hashData(em);
    const hashedFirstName = hashData(fn);
    const hashedLastName = hashData(ln);
    const externalId = hashedEmail || hashedPhone || undefined;

    // Client IP Extraction
    const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    const client_ip_address = rawIp.split(",")[0].trim();

    // Objek user_data bersih (hanya mengirimkan field yang valid)
    const userDataObj: Record<string, any> = {
      client_user_agent: req.headers["user-agent"] || "",
      client_ip_address,
    };

    if (hashedPhone) userDataObj.ph = [hashedPhone];
    if (hashedEmail) userDataObj.em = [hashedEmail];
    if (hashedFirstName) userDataObj.fn = [hashedFirstName];
    if (hashedLastName) userDataObj.ln = [hashedLastName];
    if (externalId) userDataObj.external_id = externalId;
    if (fbc) userDataObj.fbc = fbc;
    if (fbp) userDataObj.fbp = fbp;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          event_source_url: body.url || "https://radeyaphoto.com/",
          user_data: userDataObj,
          custom_data: {
            value,
            currency: "IDR",
            content_name: `Booking_${service}`,
            segment,
            service,
            type: event_type,
          },
        },
      ],
    };

    const pixelTargetId =
      segment === "frame"
        ? process.env.PIXEL_FRAME_ID || "1413881487242621"
        : process.env.PIXEL_GRADUATION_ID || "804715912719122";

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pixelTargetId}/events?access_token=${process.env.META_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, meta_error: result });
    }

    return res.status(200).json({ success: true, meta_result: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
