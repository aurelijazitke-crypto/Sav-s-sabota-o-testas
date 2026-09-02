import "@fontsource-variable/manrope/wght.css";
import "@fontsource/cardo/400.css";
import "@fontsource/cardo/400-italic.css";
import "@fontsource/cardo/700.css";
import "@/app/globals.css";

import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_TEST_URL || "https://testas.aurelijazitke.lt";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "„Geros mergaitės“ testas | Aurelija Žitkė",
    template: "%s | Aurelija Žitkė"
  },
  description:
    "15 situacijų savirefleksijos testas, padedantis pastebėti prisitaikymą, kaltę brėžiant ribas, slopinamą pyktį ir perteklinę atsakomybę už kitus.",
  applicationName: "„Geros mergaitės“ testas",
  authors: [{ name: "Aurelija Žitkė", url: "https://aurelijazitke.lt" }],
  creator: "Aurelija Žitkė",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kiek tavo gyvenimą vis dar valdo „geros mergaitės“ vaidmuo?",
    description:
      "15 kasdienių situacijų padės pamatyti, kur dėl ramybės ar ryšio palieki save paskutinę.",
    type: "website",
    locale: "lt_LT",
    siteName: "Aurelija Žitkė"
  },
  twitter: {
    card: "summary_large_image",
    title: "„Geros mergaitės“ testas",
    description:
      "Atpažink ryškiausią savo prisitaikymo strategiją per 15 kasdienių situacijų."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3E2436",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}
