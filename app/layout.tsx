import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://cadeia-alimentar-biomas-brasileiros.khangtuantham3.chatgpt.site",
  ),
  title: "Cadeia Alimentar dos Biomas Brasileiros",
  description:
    "Um jogo pedagógico para descobrir como a energia circula pelos biomas brasileiros.",
  openGraph: {
    title: "Cadeia Alimentar dos Biomas Brasileiros",
    description:
      "Atravesse cinco biomas e reconstrua o caminho da energia na natureza.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/social-card-biomas.png",
        width: 1200,
        height: 630,
        alt: "Ilustração dos cinco biomas brasileiros",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadeia Alimentar dos Biomas Brasileiros",
    description:
      "Um jogo pedagógico pelos ecossistemas do Brasil.",
    images: ["/social-card-biomas.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
