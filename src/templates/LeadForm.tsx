'use client';

import { useState } from 'react';
import { getSegment } from '@/utils/getSegment';
import { trackLead } from '@/utils/tracking';

type FormState = {
  name: string;
  campus: string;
  month: string;
  budget: string;
  instagram: string;
  wa: string;
};

const LeadForm = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    campus: '',
    month: '',
    budget: '',
    instagram: '',
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

    if (!name || !campus || !month || !wa) {
      alert('⚠️ Mohon isi data wajib');
      return;
    }

    try {
      setLoading(true);

      // 1. Jalankan tracking browser dan ambil ID uniknya
      const event_id = trackLead('graduation_form', {
        campus: form.campus,
        month: form.month,
      });

      // 2. Simpan data ke Notion
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          segment,
        }),
      });

      // 3. Kirim data ke API CAPI untuk deduplikasi (ditetapkan sebagai 'inquiry' -> Lead)
      await fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'graduation',
          type: 'inquiry', // <--- KUNCI: Agar Meta mencatat sebagai Lead
          segment,
          event_id, 
          value: 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert('❌ Gagal mengirim data');
        return;
      }

      // WHATSAPP MESSAGE (Rapi dengan enter)
      const message = `Halo Admin Radeya 👋

Saya mau tanya info paket & pricelist graduation photoshoot.

Nama: ${name}
Kampus: ${campus}
Perkiraan Wisuda: ${month}

Boleh dibantu info detail paketnya ya 🙏`;

      setForm({
        name: '',
        campus: '',
        month: '',
        budget: '',
        instagram: '',
        wa: '',
      });

      window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;
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
    !form.month.trim() ||
    !form.wa.trim();

  const fieldStyle =
    'h-[54px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-neutral-500';

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
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Lengkap *"
            className={fieldStyle}
          />

          <input
            name="campus"
            value={form.campus}
            onChange={handleChange}
            placeholder="Universitas *"
            className={fieldStyle}
          />

          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className={fieldStyle}
          >
            <option value="">Perkiraan Bulan Wisuda</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>

          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className={fieldStyle}
          >
            <option value="">Pilih Budget</option>
            <option value="400K - 600K">400K - 600K</option>
            <option value="600K - 800K">600K - 800K</option>
            <option value="800K - 1 Juta">800K - 1 Juta</option>
            <option value="1 Juta+">1 Juta+</option>
          </select>

          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram"
            className={fieldStyle}
          />

          <input
            name="wa"
            value={form.wa}
            onChange={handleChange}
            placeholder="WhatsApp *"
            className={fieldStyle}
          />

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
