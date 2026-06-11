import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },

      properties: {
        Name: {
          title: [
            {
              text: {
                content: body.name || '',
              },
            },
          ],
        },

        Campus: {
          rich_text: [
            {
              text: {
                content: body.campus || '',
              },
            },
          ],
        },

        Month: {
  rich_text: {
    name: body.month || '',
  },
},

        Budget: {
          rich_text: [
            {
              text: {
                content: body.budget || '',
              },
            },
          ],
        },

        Instagram: {
          rich_text: [
            {
              text: {
                content: body.instagram || '',
              },
            },
          ],
        },

        WhatsApp: {
          rich_text: [
            {
              text: {
                content: body.wa || '',
              },
            },
          ],
        },
      },
    });

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
    });
  }
}
