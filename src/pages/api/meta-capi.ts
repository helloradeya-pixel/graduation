import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { event_name, event_id, value, service } = req.body;

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [
            {
              event_name,
              event_time: Math.floor(Date.now() / 1000),
              event_id,
              action_source: "website",
              custom_data: {
                value: value || 0,
                currency: "IDR",
                service: service || ""
              }
            }
          ],
          access_token: process.env.META_TOKEN
        })
      }
    );

    const result = await response.json();

    return res.status(200).json({
      success: true,
      meta: result
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
