'use client';

import { useState } from 'react';
import { getSegment } from '@/utils/getSegment';
import { trackLead } from '@/utils/tracking';

type FormState = {
  name: string;
  campus: string;
  month: string;
  email: string;
  wa: string;
};

const LeadForm = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    campus: '',
    month: '',
    email: '',
    wa: '',
  });

  const [loading, setLoading] = useState(false);
  const segment = getSegment();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const campus = form.campus.trim();
    const month = form.month.trim();
    const wa = form.wa.trim();
    const email = form.email.trim();

    if (!name || !campus || !month || !wa || !email) {
      alert('⚠️ Mohon isi semua data wajib (Nama, Kampus, Bulan, Email, & WhatsApp)');
      return;
    }

    try {
      setLoading(true);

      const namaParts = name.split(' ');

      // 1. Kirim Pixel Browser + CAPI Server sekaligus via trackLead
      const event_id = trackLead(
        'graduation_form',
        {
          ph: wa,
          em: email,
          fn: namaParts[0],
          ln: namaParts.slice(1).join(' '),
          campus,
          month,
        },
        { campus, month }
      );

      // 2. Simpan ke database / Google Sheets internal kamu
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, segment, event_id }),
      });

      // 3. Redirection ke WhatsApp Admin
      const message = `Halo Admin Radeya 👋\n\nSaya mau tanya info paket & pricelist graduation photoshoot.\n\nNama: ${name}\nKampus: ${campus}\nPerkiraan Wisuda: ${month}\n\nBoleh dibantu info detail paketnya ya 🙏`;

      setForm({ name: '', campus: '', month: '', email: '', wa: '' });
      window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;
    } catch (error) {
      console.log(error);
      alert('❌ Terjadi error');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = 'h-[54px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-neutral-500';

  return (
    <section id="leadform" className="scroll-mt-32 bg-black py-28 text-white">
      <div className="mx-auto max-w-3xl px-8 md:px-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Graduation Inquiry</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Book Your Graduation Story</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap *" className={fieldStyle} />
          <input name="campus" value={form.campus} onChange={handleChange} placeholder="Universitas *" className={fieldStyle} />
          <select name="month" value={form.month} onChange={handleChange} className={fieldStyle}>
            <option value="" disabled hidden>Perkiraan Bulan Wisuda *</option>
            {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Alamat Email *" className={fieldStyle} />
          <input name="wa" value={form.wa} onChange={handleChange} placeholder="WhatsApp *" className={fieldStyle} />
          
          <button
            type="submit"
            disabled={loading}
            className={`h-[54px] w-full rounded-xl bg-white text-black font-medium transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}
          >
            {loading ? 'Mengirim...' : 'Kirim & Konsultasi'}
          </button>
        </form>
      </div>
    </section>
  );
};

export { LeadForm };
