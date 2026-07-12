import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, paket, buktiUrl } = body;

    // Menghubungkan data dari form ke kolom Notion
    // Pastikan nama properti di sini (Nama, WhatsApp, dll) 
    // sama persis dengan nama kolom di database Notion Anda
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_FRAME_DATABASE_ID! },
      properties: {
        'Nama': { title: [{ text: { content: data.namaTitel || 'Tanpa Nama' } }] },
        'WhatsApp': { rich_text: [{ text: { content: data.wa } }] },
        'Email': { email: data.email || '' },
        'Paket': { select: { name: paket.nama } },
        'Universitas': { rich_text: [{ text: { content: data.universitas || '-' } }] },
        'Jurusan': { rich_text: [{ text: { content: data.jurusan || '-' } }] },
        'Kota Wisuda': { rich_text: [{ text: { content: data.kota || '-' } }] },
        'Tanggal Wisuda': { rich_text: [{ text: { content: data.tglWisuda || '-' } }] },
        'Opsi Atribut': { rich_text: [{ text: { content: data.opsiTambahan } }] },
        'Alamat': { rich_text: [{ text: { content: data.alamat } }] },
        'Bukti Transfer': { url: buktiUrl },
      },
    });

    return NextResponse.json({ success: true, message: 'Data berhasil dikirim ke Notion!' });
  } catch (error: any) {
    console.error('Error sending to Notion:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
