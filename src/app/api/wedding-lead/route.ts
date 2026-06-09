export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 👇 TEST CONNECTION DULU
    await notion.databases.retrieve({
      database_id: process.env.NOTION_WEDDING_DATABASE_ID!,
    });

    // kalau lolos, baru create page
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_WEDDING_DATABASE_ID!,
      },

      properties: {
        Name: {
          title: [
            {
              text: { content: body.name || '' },
            },
          ],
        },

        Instagram: {
          rich_text: [
            {
              text: { content: body.instagram || '' },
            },
          ],
        },

        Domisili: {
          rich_text: [
            {
              text: { content: body.domisili || '' },
            },
          ],
        },

        Service: {
          rich_text: [
            {
              text: { content: body.service || '' },
            },
          ],
        },

        WhatsApp: {
          rich_text: [
            {
              text: { content: body.wa || '' },
            },
          ],
        },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log('NOTION ERROR:', error);

    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}
