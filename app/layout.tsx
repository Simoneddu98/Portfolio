import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "@/components/ui/ContactModalContext";
import { ContactModal } from "@/components/ui/ContactModal";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simone Sanna — Formatore AI e Marketing Specialist",
  description:
    "Milano · insegno a usare l'AI senza diventare schiavi dell'AI. Formazioni aziendali, consulenza, contenuti.",
  openGraph: {
    title: "Simone Sanna — Formatore AI e Marketing Specialist",
    description: "Milano · insegno a usare l'AI senza diventare schiavi dell'AI.",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-[100svh] overflow-x-hidden">
          <ContactModalProvider>
            {children}
            <ContactModal />
          </ContactModalProvider>
        </body>
    </html>
  );
}
