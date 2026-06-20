import type { NextApiRequest, NextApiResponse } from "next";

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
    // INPUT
    // =========================
    const service = body.service || "unknown";
    const value = Number(body.value || 0);
    const event_id = body.event_id || `${service}_${Date.now()}`;
    const segment = body.segment || service;
    
    // PEMISAH TYPE: Jika kirim 'booking' jadi Purchase, jika 'inquiry' jadi Lead
    const event_type = body.type || 'inquiry'; 
    const event_name = event_type === 'booking' ? 'Purchase' : 'Lead';

    console.log(`🔥 CAPI HIT [v20.0] | Event: ${event_name} | Service: ${service}`);

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          user_data: {
            client_user_agent: req.headers["user-agent"] || "",
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
      debug: { event_name, event_id, service },
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
