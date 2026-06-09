import "./Radeyaphoto.css";
import { Testimonial } from "../Testimonial";

export default function RadeyaphotoPage() {
  return (
    <div className="radeyaphoto">

      <div className="hero"></div>

      <div className="profile-section">
        <img
          src="/assets/images/profile.jpg"
          alt="profile"
          className="profile-img"
        />

        <h1>Radeyaphoto</h1>

        <p>
          Some memories live in soft light and silent smiles.
          <br />
          I capture them so years from now,
          <br />
          you’ll remember not just how it looked,
          <br />
          but how it felt.
        </p>

        <div className="buttons">

          <a
            href="https://wa.me/628211251570"
            target="_blank"
            className="link-btn"
          >
            WHATSAPP ADMIN
          </a>

          <a
            href="https://instagram.com/radeyaphoto"
            target="_blank"
            className="link-btn"
          >
            INSTAGRAM WEDDING
          </a>

          <a
            href="https://instagram.com/radeya.graduation"
            target="_blank"
            className="link-btn"
          >
            INSTAGRAM WISUDA
          </a>

        </div>
      </div>

      <Testimonial />

      {/* BOTTOM */}
        <div className="mt-10 border-t border-white/5 pt-5 text-center text-[11px] tracking-wide text-neutral-500">
  © {new Date().getFullYear()} Radeya Photography. All rights reserved.
</div>


    </div>
  );
}
