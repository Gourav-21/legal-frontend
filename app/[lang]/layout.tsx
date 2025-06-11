import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/manrope";
import "@fontsource/space-grotesk";
import "../globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import Script from "next/script";
import AOSInit from "../aos-init"; // Adjusted path
import { i18n, type Locale } from "../../i18n-config"; // Import i18n config
import { getDictionary } from "../../get-dictionary"; // Import dictionary loader
import Navbar from "../../components/Navbar"; // Import Navbar component
import Footer from "../../components/Footer"; // Import Footer component

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: "Paynalyze - Payroll Analysis Made Simple",
  description: "Easily upload, analyze, and review your payroll reports.",
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
  }
) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang); // Fetch dictionary

  const {
    children
  } = props;

  return (
    <html lang={params.lang} dir={params.lang === 'he' ? 'rtl' : 'ltr'}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous" referrerPolicy="no-referrer" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>

            <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon"></link>
          </head>
          <body className={inter.className}>
            <AOSInit />
            <Navbar lang={params.lang} dictionary={dictionary} /> {/* Use Navbar component */}
            {children}
            <Footer lang={params.lang} dictionary={dictionary} /> {/* Use Footer component */}
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
          </body>
        </html>
        );
}
