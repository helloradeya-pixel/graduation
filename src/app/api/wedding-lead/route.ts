import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_WEDDING_DATABASE_ID!,
      },
      properties: {
        Name: {
          title: [{ text: { content: body.name || '' } }],
        },
        email: {
          email: body.email || null,
        },
        Domisili: {
          rich_text: [{ text: { content: body.domisili || '' } }],
        },
        Service: {
          select: {
            name: body.service || 'Prewedding', // Default aman
          },
        },
        WhatsApp: {
          rich_text: [{ text: { content: body.wa || '' } }],
        },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('NOTION ERROR:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
