import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description:
    "Modern finance dashboard with transactions, role controls, insights, and local persistence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var raw = window.localStorage.getItem('finance-dashboard-store');
              var parsed = raw ? JSON.parse(raw) : null;
              var theme = parsed && parsed.state && parsed.state.theme ? parsed.state.theme : 'light';
              var root = document.documentElement;
              root.classList.toggle('dark', theme === 'dark');
              root.style.colorScheme = theme;
            } catch (error) {}
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
