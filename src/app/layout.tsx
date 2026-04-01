import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aihubs PRO - AI & MMO Portal",
    template: "%s | Aihubs PRO",
  },
  description: "Khám phá Top List AI, Khóa học MMO và Blog chia sẻ kiến thức thực chiến.",
  keywords: ["AI", "MMO", "ChatGPT", "Claude", "Gemini", "Blog AI", "Aihubs PRO"],
  authors: [{ name: "Aihubs PRO", url: "https://aihubs.pro" }],
  creator: "Aihubs PRO",
  metadataBase: new URL("https://aihubs.pro"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://aihubs.pro",
    siteName: "Aihubs PRO",
    title: "Aihubs PRO - AI & MMO Portal",
    description: "Khám phá Top List AI, Khóa học MMO và Blog chia sẻ kiến thức thực chiến.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Aihubs PRO" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aihubs PRO - AI & MMO Portal",
    description: "Khám phá Top List AI, Khóa học MMO và Blog chia sẻ kiến thức.",
    site: "@aihubspro",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark bg-slate-950" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${outfit.variable} bg-slate-950 antialiased selection:bg-primary/30 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 mt-[80px]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
