import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Koywe Challenge',
  description: 'Frontend para el desafío técnico de Koywe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className="h-full">{children}</body>
    </html>
  );
}
