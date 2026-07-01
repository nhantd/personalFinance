import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { COLORS } from "@/lib/colors";
import { buildRootMetadata } from "@/lib/seo/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: COLORS.darkGreen,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background font-sans text-foreground"
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
