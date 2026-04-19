import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default:
      "Maestra Esthela Damián Peralta · La mejor opción para Guerrero 2027",
    template: "%s · Maestra Esthela Damián · Guerrero 2027",
  },
  description:
    "Sitio ciudadano en apoyo a la Maestra Esthela Damián Peralta como la mejor opción para el estado de Guerrero en 2027. Conoce su trayectoria y súmate al cambio.",
  keywords: [
    "Esthela Damián",
    "Guerrero 2027",
    "EsConE",
    "candidata Guerrero",
    "ciudadanía",
  ],
  openGraph: {
    title: "Maestra Esthela Damián Peralta · Guerrero 2027",
    description:
      "Trayectoria, propuestas y cómo sumarte al proyecto ciudadano #EsConE.",
    locale: "es_MX",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
