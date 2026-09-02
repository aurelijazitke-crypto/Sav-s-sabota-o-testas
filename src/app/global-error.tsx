"use client";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="lt">
      <body
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          margin: 0,
          padding: 24,
          background: "#f6f0e6",
          color: "#3e2436",
          fontFamily: "Georgia, serif"
        }}
      >
        <main style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ color: "#7c4426", letterSpacing: "0.14em" }}>
            TRUMPA PAUZĖ
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 400, marginBottom: 12 }}>
            Puslapio įkelti nepavyko
          </h1>
          <p style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
            Ryšys galėjo trumpam sutrikti. Pabandyk įkelti testą dar kartą.
          </p>
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: 18,
              minHeight: 52,
              padding: "12px 24px",
              border: 0,
              borderRadius: 999,
              background: "#3e2436",
              color: "#fffdf9",
              cursor: "pointer",
              font: "700 14px Arial, sans-serif"
            }}
          >
            Bandyti dar kartą
          </button>
        </main>
      </body>
    </html>
  );
}
