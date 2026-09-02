import { ImageResponse } from "next/og";

export const alt =
  "Kiek tavo gyvenimą vis dar valdo geros mergaitės vaidmuo?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#f6f0e6",
        color: "#3e2436",
        fontFamily: "Georgia, serif"
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 430,
          height: 430,
          right: -170,
          top: -190,
          display: "flex",
          border: "55px solid rgba(179, 101, 47, 0.12)",
          borderRadius: "50%"
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 440,
          height: 440,
          left: -300,
          bottom: -250,
          display: "flex",
          border: "2px solid rgba(62, 36, 54, 0.12)",
          borderRadius: "50%"
        }}
      />
      <div
        style={{
          width: 1010,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: 28,
            color: "#7c4426",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.16em"
          }}
        >
          SAVIREFLEKSIJOS TESTAS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 72,
            lineHeight: 1.06,
            letterSpacing: "-0.045em"
          }}
        >
          <span>Kiek tavo gyvenimą vis dar valdo</span>
          <span style={{ color: "#b3652f", fontStyle: "italic" }}>
            „geros mergaitės“ vaidmuo?
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontFamily: "Arial, sans-serif",
            fontSize: 21,
            color: "#654657"
          }}
        >
          15 situacijų · 5 vidinės kryptys · Aurelija Žitkė
        </div>
      </div>
    </div>,
    size
  );
}
