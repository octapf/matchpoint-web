import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { ReduxProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Matchpoint — Torneos",
    template: "%s | Matchpoint",
  },
  description:
    "Torneos públicos de beach vóley: listado, equipos, partidos y clasificación. Datos desde la API de Matchpoint.",
  icons: {
    icon: "/favicon.png",
    apple: "/matchpoint-app-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <SkipLink />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
