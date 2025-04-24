import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/manrope";
import "@fontsource/space-grotesk";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import Script from "next/script";
import AOSInit from "./aos-init";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paynalyze - Payroll Analysis Made Simple",
  description: "Easily upload, analyze, and review your payroll reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <AOSInit />
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
