import './globals.css';
import FooterComponent from '@/components/ui/FooterComponent';
import type { Metadata } from 'next';
import NavbarComponent from '@/components/ui/NavbarComponent';
import Providers from '@/app/providers';
import localFont from 'next/font/local';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// const montserrat = localFont({
//   src: './fonts/Montserrat-Regular.woff',
//   variable: '--font-montserrat',
//   weight: '100 900',
// });

export const metadata: Metadata = {
  title: 'PvM RPG - Trackmania Players Versus Maps',
  description: 'Come discover some incredible RPG maps, grind your times !',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background font-[family-name:var(--font-geist-sans)]`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavbarComponent />
            <main className="flex-grow">{children}</main>
            <FooterComponent />
          </div>
        </Providers>
      </body>
    </html>
  );
}
