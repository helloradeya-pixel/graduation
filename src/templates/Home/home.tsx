import "./Radeyaphoto.css";
import Testimonial from "../Testimonial";

export default function RadeyaphotoPage() {
  return (
    <div className="radeyaphoto">

      <div className="hero"></div>

      <div className="profile-section">
        <img
          src="/profile.jpg"
          alt="profile"
          className="profile-img"
        />

        <h1>Imagenic</h1>
        <p>Photography & Videography</p>

        <div className="buttons">

          <a
            href="https://wa.me/628211521570"
            target="_blank"
            className="link-btn"
          >
            WHATSAPP
          </a>

          <a
            href="https://instagram.com/radeyaphoto"
            target="_blank"
            className="link-btn"
          >
            IG WEDDING
          </a>

          <a
            href="https://instagram.com/radeya.graduation"
            target="_blank"
            className="link-btn"
          >
            IG WISUDA
          </a>

        </div>
      </div>

      <Testimonial />

    </div>
  );
}
