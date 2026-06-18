import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // 🔥 FORCE PARSE BODY (ANTI EMPTY BUG)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const event_name = body?.event_name;
    const event_id = body?.event_id;
    const value = body?.value || 0;
    const service = body?.service || "";

    // 🔥 DEBUG SAFETY
    if (!event_name) {
      return res.status(400).json({
        error: "Missing event_name",
        received_body: body,
      });
    }

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

    return res.status(200).json({
      success: true,
      sent_payload: payload,
      meta: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
