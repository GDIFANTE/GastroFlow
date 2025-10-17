// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GastroFlow",
  description: "Gestão de restaurante",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-50`}>
        <nav className="sticky top-0 z-10 bg-white border-b">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-2xl font-semibold text-orange-500">GastroFlow</Link>
            <div className="flex gap-4 text-sm text-black font-medium">
              <Link href="/cardapio">Cardápio</Link>
              <Link href="/pedidos">Pedidos</Link>
              <Link href="/clientes">Clientes</Link>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </body>
    </html>
  );
}
