'use client';

import { useState } from 'react';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // META PIXEL EVENT
  const fireLeadEvent = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Graduation Pricelist',
        campus: form.campus,
        budget: form.budget,
      });
    }
  };

  // GOOGLE ANALYTICS EVENT
  const fireGAEvent = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'lead_form',
        event_label: 'graduation_pricelist',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const campus = form.campus.trim();
    const date = form.date.trim();
    const wa = form.wa.trim();

    if (!name || !campus || !date || !wa) {
      alert('⚠️ Mohon isi Nama, Kampus, Tanggal, dan WhatsApp terlebih dahulu');
      return;
    }

    try {
      setLoading(true);

      // 1. SAVE KE NOTION / API
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert('❌ Gagal mengirim data');
        return;
      }

      // 2. FIRE TRACKING (IMPORTANT)
      fireLeadEvent();
      fireGAEvent();

      // 3. REDIRECT WHATSAPP
      const message = `Halo admin 👋

Saya mau tanya info paket & pricelist graduation photoshoot.

Nama: ${name}
Kampus: ${campus}

Boleh dibantu info detail paketnya ya 🙏`;

      const url = `https://wa.me/628211251570?text=${encodeURIComponent(
        message,
      )}`;

      window.open(url, '_blank');

      // 4. RESET FORM
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
    h-[54px]
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    px-4
    text-sm
    text-white
    outline-none
    placeholder:text-neutral-500
  `;

  return (
    <section id="leadform" className="scroll-mt-32 bg-black py-28 text-white">
      <div className="mx-auto max-w-3xl px-8 md:px-16">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Graduation Booking
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Book Your Graduation Story
          </h2>

          <p className="mt-6 text-sm text-neutral-400 md:text-base">
            Isi data kamu, pilih tanggal, lalu kirim untuk konsultasi WhatsApp.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-4">

          <input
            name="name"
            value={form.name}
            placeholder="Nama Lengkap *"
            onChange={handleChange}
            className={fieldStyle}
          />

          <input
            name="campus"
            value={form.campus}
            placeholder="Universitas *"
            onChange={handleChange}
            className={fieldStyle}
          />

          <div className="flex h-[54px] w-full items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4">
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-white outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className={fieldStyle}
          >
            <option value="">Pilih Range Budget</option>
            <option value="200K - 300K">200K - 300K</option>
            <option value="300K - 400K">300K - 400K</option>
            <option value="400K - 500K">400K - 500K</option>
            <option value="500K - 600K">500K - 600K</option>
            <option value="600K - 800K">600K - 800K</option>
          </select>

          <input
            name="instagram"
            value={form.instagram}
            placeholder="Instagram"
            onChange={handleChange}
            className={fieldStyle}
          />

          <input
            name="wa"
            value={form.wa}
            placeholder="WhatsApp aktif *"
            onChange={handleChange}
            className={fieldStyle}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isDisabled || loading}
            className="
              h-[54px]
              w-full
              rounded-xl
              bg-white
              px-4
              text-sm
              font-medium
              text-black
              transition
              hover:bg-neutral-200
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {loading ? 'Mengirim...' : 'Kirim & Konsultasi Sekarang →'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <span>🔒</span>
          <p>Data kamu aman & tidak akan dibagikan ke pihak lain</p>
        </div>

      </div>
    </section>
  );
};

export { LeadForm };
