'use client';

import { useState } from 'react';
import { getSegment } from '@/utils/getSegment';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // META PIXEL
  const fireLeadEvent = () => {
    if (typeof window === 'undefined') return;

    window.fbq?.('track', 'Lead', {
      content_name: `${segment}_lead_form`,
      content_category: segment,
      service: form.service || 'unknown',
    });
  };

  // GA4
  const fireGAEvent = () => {
    if (typeof window === 'undefined') return;

    window.gtag?.('event', 'generate_lead', {
      event_category: segment,
      event_label: 'lead_form_submit',
    });
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

      const res = await fetch('/api/wedding-lead', {
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

      // TRACKING
      fireLeadEvent();
      fireGAEvent();

      const message = `Halo admin 👋

Saya mau tanya info paket & pricelist:

Segment: ${segment}
Nama: ${name}
Instagram: ${form.instagram || '-'}
Domisili: ${form.domisili || '-'}
Paket: ${form.service || '-'}`;

      const url = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

      window.open(url, '_blank');

      setForm({
        name: '',
        instagram: '',
        domisili: '',
        service: '',
        wa: '',
      });
    } catch (error) {
      console.error(error);
      alert('❌ Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !form.name.trim() || !form.wa.trim();

  const fieldStyle =
    'h-[54px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-neutral-500';

  return (
    <section id="leadform" className="scroll-mt-32 bg-black py-28 text-white">
      <div className="mx-auto max-w-3xl px-8 md:px-16">

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            {segment === 'couple'
              ? 'Couple Inquiry'
              : segment === 'graduation'
              ? 'Graduation Inquiry'
              : 'Photography Inquiry'}
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Book Your Session
          </h2>

          <p className="mt-6 text-sm text-neutral-400 md:text-base">
            Isi data kamu untuk konsultasi langsung via WhatsApp.
          </p>
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
            <option value="Graduation">Graduation</option>
          </select>

          <input name="wa" value={form.wa} onChange={handleChange} placeholder="WhatsApp aktif *" className={fieldStyle} />

          <button
            type="submit"
            disabled={isDisabled || loading}
            className="h-[54px] w-full rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
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
