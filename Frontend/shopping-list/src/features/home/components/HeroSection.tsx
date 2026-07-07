import { Link } from "@tanstack/react-router";

const items = [
  { label: "Milch, 1,5%", price: "2,49", done: true },
  { label: "Bananen", price: "1,29", done: true },
  { label: "Kaffeebohnen", price: "8,99", done: false },
  { label: "Spuelmittel", price: "3,49", done: false },
];

export function HeroSection() {
  return (
    <section
      style={{
        background: "#1F3D2E",
        padding: "6rem 1.5rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap');
        .hero-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 800px) {
          .hero-grid { grid-template-columns: 1fr; gap: 3rem; }
        }
        .receipt-card {
          transform: rotate(-3deg);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .receipt-wrap:hover .receipt-card {
          transform: rotate(-1deg);
        }
        .cta-primary:hover { background: #f0ae57 !important; }
        .cta-secondary:hover { border-color: #E8A33D !important; color: #E8A33D !important; }
        .item-row { display: flex; align-items: baseline; justify-content: space-between; padding: 0.4rem 0; }
        .checkbox {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border: 1.5px solid #2B2A25;
          margin-right: 10px;
          font-size: 10px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="hero-grid">
        <div>
          <div
            style={{
              display: "inline-block",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E8A33D",
              marginBottom: "1.5rem",
            }}
          >
            greenlist — eure einkaufsliste
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.08,
              color: "#FAF6EC",
              margin: "0 0 1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            Nie mehr zweimal
            <br />
            Milch kaufen.
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "#A9C0AE",
              maxWidth: "440px",
              margin: "0 0 2.25rem",
            }}
          >
            Eine geteilte Liste fuer alle im Haushalt. Wer im Laden steht, sieht
            sofort, was fehlt, was schon im Wagen liegt und was es kostet.
          </p>

          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <Link
              to="/sign-in"
              className="cta-primary"
              style={{
                background: "#E8A33D",
                color: "#1F3D2E",
                border: "none",
                borderRadius: "6px",
                padding: "0.85rem 1.6rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Liste anlegen
            </Link>
            <Link
              to="/sign-up"
              className="cta-secondary"
              style={{
                background: "transparent",
                color: "#FAF6EC",
                border: "1.5px solid #3E5C4B",
                borderRadius: "6px",
                padding: "0.85rem 1.6rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.2s ease, color 0.2s ease",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Konto erstellen
            </Link>
          </div>
        </div>

        <div
          className="receipt-wrap"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            className="receipt-card"
            style={{
              background: "#FAF6EC",
              width: "290px",
              padding: "1.75rem 1.5rem 1.5rem",
              boxShadow: "0 24px 48px rgba(0,0,0,0.28)",
              borderRadius: "2px",
              fontFamily: "'IBM Plex Mono', monospace",
              color: "#2B2A25",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                marginBottom: "0.9rem",
              }}
            >
              GREENLIST
            </div>
            <div
              style={{
                borderTop: "1.5px dashed #C7BFA9",
                marginBottom: "0.6rem",
              }}
            />

            {items.map((item, i) => (
              <div
                key={i}
                className="item-row"
                style={{
                  color: item.done ? "#8C8873" : "#2B2A25",
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="checkbox"
                    style={{
                      background: item.done ? "#2B2A25" : "transparent",
                      color: "#FAF6EC",
                    }}
                  >
                    {item.done ? "✓" : ""}
                  </span>
                  {item.label}
                </span>
                <span style={{ fontSize: "13px" }}>{item.price} €</span>
              </div>
            ))}

            <div
              style={{ borderTop: "1.5px dashed #C7BFA9", margin: "0.7rem 0" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span>Gesamt (offen)</span>
              <span>12,48 €</span>
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "10px",
                color: "#A39D82",
                marginTop: "1.1rem",
                letterSpacing: "0.04em",
              }}
            >
              4 artikel · aktualisiert gerade eben
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
