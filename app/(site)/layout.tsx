import "../globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export const metadata: Metadata = {
  title: "ARKA Living",
  description: "Gestión inteligente de rentas cortas en Colombia.",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div id="app-root">
          <Header />
          <main>{children}</main>

          <Footer />
          <FloatingCTA />
        </div>
      </body>
    </html>
  );
}
