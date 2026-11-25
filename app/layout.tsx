import type { Metadata } from 'next';
import { Anton, Barlow_Condensed } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

// Fontes do app (OFL-1.1): Anton nos títulos, Barlow Condensed no texto.
const display = Anton({ variable: '--font-display', weight: '400', subsets: ['latin'] });
const body = Barlow_Condensed({ variable: '--font-body', weight: ['500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://versusproject.vercel.app'),
  title: { default: 'Versus — batalhas de rima', template: '%s · Versus' },
  description: 'Onde e quando tem batalha de rima, com ranking e chave de cada edição.',
  openGraph: { siteName: 'Versus', locale: 'pt_BR', type: 'website' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="top">
          <Link href="/" className="display brand">
            Versus
          </Link>
          <span className="muted">Batalhas de rima</span>
        </header>
        {children}
        <footer className="muted">
          Organiza batalha? Use o app Versus. ·{' '}
          <a className="link" href="/legado/">
            Palco antigo
          </a>
        </footer>
      </body>
    </html>
  );
}
