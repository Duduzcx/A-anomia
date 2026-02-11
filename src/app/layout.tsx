import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'A Anomia',
  description: 'Um blog contemporâneo sobre filosofia.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚪️</text></svg>",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full" style={{scrollBehavior: 'smooth'}}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased min-h-screen bg-background flex flex-col"
      )}>
        <Providers>
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
