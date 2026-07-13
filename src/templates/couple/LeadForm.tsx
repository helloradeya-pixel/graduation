'use client';

import { useState } from 'react';
import { getSegment } from '@/utils/getSegment';
import { trackLead } from '@/utils/tracking';

type FormState = {
  name: string;
  instagram: string;
  domisili: string;
  service: string;
  wa: string;
};

const LeadForm = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    instagram: '',
    domisili: '',
    service: '',
    wa: '',
  });

  const [loading, setLoading] = useState(false);
  const segment = getSegment();

  // Helper untuk mengambil cookies tracking
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const wa = form.wa.trim();

    if (!name || !wa) {
      alert('⚠️ Nama dan WhatsApp wajib diisi');
      return;
    }

    try {
      setLoading(true);

      const namaParts = name.split(' ');
      const fbc = getCookie('_fbc');
      const fbp = getCookie('_fbp');

      // 1. Jalankan tracking browser (WA disisipkan di argumen ke-3)
      const event_id = trackLead('couple_form', {
        service: form.service || 'unknown',
        domisili: form.domisili || '-',
        instagram: form.instagram || '-',
      }, wa);

      // 2. Simpan Lead ke Database (Notion)
      const res = await fetch('/api/wedding-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, segment }),
      });

      // 3. Kirim ke Meta CAPI dengan parameter lengkap
      await fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'couple',
          type: 'inquiry', 
          segment,
          event_id, 
          value: 0,
          url: window.location.href,
          user_data: { 
            ph: wa,
            fn: namaParts[0],
            ln: namaParts.slice(1).join(' '),
            fbc: fbc,
            fbp: fbp
          }
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert('❌ Gagal mengirim data');
        return;
      }

      const message = `Halo Admin Radeya 👋

Saya mau tanya info paket & pricelist couple photoshoot:

Nama: ${name}
Instagram: ${form.instagram || '-'}
Domisili: ${form.domisili || '-'}
Paket: ${form.service || '-'}

Boleh dibantu info detail paketnya ya 🙏`;

      window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

      setForm({ name: '', instagram: '', domisili: '', service: '', wa: '' });

    } catch (error) {
      console.error(error);
      alert('❌ Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !form.name.trim() || !form.wa.trim();
  const fieldStyle = 'h-[54px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-neutral-500';

  return (
    <section id="leadform" className="scroll-mt-32 bg-black py-28 text-white">
      <div className="mx-auto max-w-3xl px-8 md:px-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Couple Inquiry</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Book Your Session</h2>
          <p className="mt-6 text-sm text-neutral-400 md:text-base">Isi data kamu untuk konsultasi langsung via WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap *" className={fieldStyle} />
          <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram" className={fieldStyle} />
          <input name="domisili" value={form.domisili} onChange={handleChange} placeholder="Domisili" className={fieldStyle} />
          <select name="service" value={form.service} onChange={handleChange} className={fieldStyle}>
            <option value="">Pilih Paket</option>
            <option value="Prewedding">Prewedding</option>
            <option value="Engagement">Engagement</option>
            <option value="Wedding">Wedding</option>
          </select>
          <input name="wa" value={form.wa} onChange={handleChange} placeholder="WhatsApp aktif *" className={fieldStyle} />
          <button type="submit" disabled={isDisabled || loading} className="h-[54px] w-full rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? 'Mengirim...' : 'Konsultasi Sekarang →'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <span>🔒</span>
          <p>Data kamu aman & tidak akan dibagikan ke pihak lain</p>
        </div>
      </div>
    </section>
  );
};

export { LeadForm };
