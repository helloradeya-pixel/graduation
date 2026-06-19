import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    // =========================
    // SAFE BODY PARSE
    // =========================
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    console.log("🔥 CAPI HIT");
    console.log("RAW BODY:", body);


    // =========================
    // INPUT
    // =========================
    const service = body.service || "unknown";

    const value = Number(body.value || 0);

    const event_id =
      body.event_id ||
      `${service}_${Date.now()}`;


    console.log("SERVICE RECEIVED:", service);
    console.log("VALUE RECEIVED:", value);
    console.log("EVENT ID RECEIVED:", event_id);


    // =========================
    // EVENT NAME
    // =========================
    let event_name = "";

    if (service === "graduation") {
      event_name = "CompleteRegistration_Graduation";
    }

    if (service === "couple") {
      event_name = "CompleteRegistration_Couple";
    }

    if (!event_name) {
      event_name = "CompleteRegistration";
    }


    console.log("FINAL EVENT NAME:", event_name);


    // =========================
    // META CAPI PAYLOAD
    // =========================
    const payload = {
      data: [
        {
          event_name,

          event_time: Math.floor(
            Date.now() / 1000
          ),

          event_id,

          action_source: "website",

          custom_data: {
            value,
            currency: "IDR",
            service,
          },
        },
      ],
    };


    console.log(
      "FINAL META PAYLOAD:",
      JSON.stringify(payload)
    );


    // =========================
    // SEND TO META
    // =========================
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.PIXEL_ID}/events?access_token=${process.env.META_TOKEN}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );


    const result = await response.json();


    console.log(
      "META RESPONSE:",
      result
    );


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

    console.log(
      "🔥 CAPI ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
}
