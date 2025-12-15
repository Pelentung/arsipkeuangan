import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ConditionalLayout } from '@/components/app/conditional-layout';

export const metadata: Metadata = {
  title: 'ARSIP DATA KONTRAK',
  description: 'Simpan dan kelola kontrak Anda dengan aman.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8805948047019009"
     crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </FirebaseClientProvider>
        <Toaster />
        <SpeedInsights/>
      </body>
    </html>
  );
}
