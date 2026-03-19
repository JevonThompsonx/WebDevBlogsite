import type { Metadata } from "next";
import { JetBrains_Mono, Sora, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { publicEnv } from "@/lib/env";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.description,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: publicEnv.NEXT_PUBLIC_APP_URL,
    jobTitle: siteConfig.title,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [siteConfig.github, siteConfig.linkedin],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${sora.variable} ${sourceSans.variable} ${jetbrainsMono.variable}`}
      >
        <Providers>
          <div className="page-shell flex min-h-screen flex-col">
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            <Header />
            <main className="flex-1" id="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
