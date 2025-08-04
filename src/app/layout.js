import Footer from "@/shared/Footer";
import ClientLayout from "@/shared/ClientLayout";
// import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import "@/styles/globals.css";

export const metadata = {
  title: "Biblioteca Digital de Planeación | Gobierno del Estado de Hidalgo",
  description:
    "Consulta y participa en la Actualización del Biblioteca Digital de Planeación impulsado por la Unidad de Planeación y Prospectiva del Gobierno del Estado de Hidalgo.",
  icons: {
    icon: "/favicon.ico",
  },
  authors: [
    {
      name: "Unidad de Planeación y Prospectiva - Coordinación General de Planeación y Proyectos - Gabriel Gómez Gómez",
      // url: "https://planestataldedesarrollo.hidalgo.gob.mx", // personalizar
    },
  ],
  // Open Graph (para compartir en redes como Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "Biblioteca Digital de Planeación | Gobierno de Hidalgo",
    description:
      "Consulta y participa en la Actualización del Biblioteca Digital de Planeación impulsado por la Unidad de Planeación y Prospectiva del Gobierno del Estado de Hidalgo.",
    url: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/",
    siteName: "Biblioteca Digital de Planeación",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Biblioteca Digital de Planeación",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  // URL base para generar links absolutos
  metadataBase: new URL("https://planestataldedesarrollo.hidalgo.gob.mx"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* <GoogleAnalytics /> */}
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
