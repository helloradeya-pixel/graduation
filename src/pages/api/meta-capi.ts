import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // =========================
    // SAFE BODY PARSING (ANTI ERROR)
    // =========================
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // =========================
    // EXTRACT DATA (FORCE SAFE)
    // =========================
    const service = body?.service || "unknown";
    const value = Number(body?.value || 0);
    const event_id = body?.event_id || `${service}_${Date.now()}`;

    // =========================
    // FORCE VALID EVENT NAME
    // =========================
    const event_name =
      service === "graduation"
        ? "CompleteRegistration_Graduation"
        : service === "couple"
        ? "CompleteRegistration_Couple"
        : "CompleteRegistration";

    // =========================
    // DEBUG LOG (WAJIB)
    // =========================
    console.log("🔥 META CAPI HIT");
    console.log("BODY RAW:", req.body);
    console.log("BODY PARSED:", body);
    console.log("EVENT NAME:", event_name);
    console.log("EVENT ID:", event_id);

    // =========================
    // FINAL PAYLOAD TO META
    // =========================
    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          custom_data: {
            value,
            currency: "IDR",
            service,
          },
        },
      ],
      access_token: process.env.META_TOKEN,
    };

    // =========================
    // SEND TO META
    // =========================
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("META RESPONSE:", result);

    return res.status(200).json({
      success: true,
      debug: {
        event_name,
        event_id,
        value,
        service,
      },
      meta: result,
    });
  } catch (error: any) {
    console.log("CAPI ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
