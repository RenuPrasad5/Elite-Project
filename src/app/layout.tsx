import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "EVIL ELITE | Luxury Trading Platform",
    template: "%s | EVIL ELITE"
  },
  description: "Next-generation institutional-grade derivative trading engine. Execute high-frequency trades with institutional precision.",
  keywords: ["trading", "luxury", "crypto", "forex", "derivatives", "saas", "evil elite", "institutional", "high-frequency"],
  authors: [{ name: "EVIL ELITE Development Node" }],
  creator: "EVIL ELITE",
  publisher: "EVIL ELITE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "EVIL ELITE",
    title: "EVIL ELITE | Luxury Trading Platform",
    description: "Next-generation institutional-grade derivative trading engine. Execute high-frequency trades with institutional precision.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EVIL ELITE Luxury Trading Dashboard",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVIL ELITE | Luxury Trading Platform",
    description: "Next-generation institutional-grade derivative trading engine. Execute high-frequency trades with institutional precision.",
    images: ["/og-image.png"],
    creator: "@evilelite",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#030303] text-zinc-100 font-sans">
        <AuthProvider>
          <CartProvider>
            <GamificationProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </GamificationProvider>
          </CartProvider>
        </AuthProvider>
        <GoogleAnalytics gaId="G-BDQR8796FH" />
      </body>
    </html>
  );
}
