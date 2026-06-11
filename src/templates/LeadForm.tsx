'use client';

import { useState } from 'react';
import { getSegment } from '@/utils/getSegment';
import { trackLead, trackWA } from '@/utils/tracking';

type FormState = {
  name: string;
  campus: string;
  date: string;
  budget: string;
  instagram: string;
  wa: string;
};

const LeadForm = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    campus: '',
    date: '',
    budget: '',
    instagram: '',
    wa: '',
  });

  const [loading, setLoading] = useState(false);

  const segment = getSegment();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const campus = form.campus.trim();
    const date = form.date.trim();
    const wa = form.wa.trim();

    if (!name || !campus || !date || !wa) {
      alert('⚠️ Mohon isi data wajib');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          segment,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert('❌ Gagal mengirim data');
        return;
      }

      // META + GA4
      trackLead('graduation_form', {
        campus: form.campus,
        date: form.date,
      });

      trackWA('graduation_pricelist', {
        campus: form.campus,
      });

      // WA MESSAGE (NO SEGMENT, NO BUDGET)
      const message = `Halo admin 👋

Saya mau tanya info paket graduation photoshoot:

Nama: ${name}
Kampus: ${campus}
Tanggal: ${date}
Instagram: ${form.instagram || '-'}`;

      const url = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

      window.open(url, '_blank');

      setForm({
        name: '',
        campus: '',
        date: '',
        budget: '',
        instagram: '',
        wa: '',
      });
    } catch (error) {
      console.log(error);
      alert('❌ Terjadi error');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !form.name.trim() ||
    !form.campus.trim() ||
    !form.date.trim() ||
    !form.wa.trim();

  const fieldStyle = `
    h-[54px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-neutral-500
  `;

  return (
    <section id="leadform" className="scroll-mt-32 bg-black py-28 text-white">
      <div className="mx-auto max-w-3xl px-8 md:px-16">

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Graduation Inquiry
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Book Your Graduation Story
          </h2>

          <p className="mt-6 text-sm text-neutral-400 md:text-base">
            Isi data kamu untuk konsultasi WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-4">

          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap *" className={fieldStyle} />
          <input name="campus" value={form.campus} onChange={handleChange} placeholder="Universitas *" className={fieldStyle} />

          <input type="date" name="date" value={form.date} onChange={handleChange} className={fieldStyle} />

          <select name="budget" value={form.budget} onChange={handleChange} className={fieldStyle}>
            <option value="">Pilih Budget</option>
            <option value="400K - 600K">400K - 600K</option>
            <option value="600K - 800K">600K - 800K</option>
            <option value="800K - 1 Juta">800K - 1 Juta</option>
            <option value="1 Juta+">1 Juta+</option>
          </select>

          <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram" className={fieldStyle} />

          <input name="wa" value={form.wa} onChange={handleChange} placeholder="WhatsApp *" className={fieldStyle} />

          <button
            type="submit"
            disabled={isDisabled || loading}
            className="h-[54px] w-full rounded-xl bg-white text-black font-medium"
          >
            {loading ? 'Mengirim...' : 'Kirim & Konsultasi'}
          </button>
        </form>
      </div>
    </section>
  );
};

export { LeadForm };
