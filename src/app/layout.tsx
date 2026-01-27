

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AIStateProvider } from '@/lib/ai/context';
import { WorkshopInquiryProvider } from '@/hooks/use-workshop-inquiry';
import { WorkshopInquiryModal } from '@/components/workshop-inquiry-modal';
import { UserInfoPopupProvider } from '@/hooks/use-user-info-popup';
import { UserInfoPopupModal } from '@/components/user-info-popup-modal';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { AuthStateObserver } from '@/firebase/auth/AuthStateObserver';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'AnaTech Labs – Environmental & OHS Testing',
  description: 'Integrated laboratory services for air, water, soil, workplace exposure and food safety across India.',
  openGraph: {
    title: 'AnaTech Labs – Environmental & OHS Testing',
    description: 'Environmental monitoring and occupational health solutions with accredited laboratories.',
    url: 'https://anatechlabs.com',
    siteName: 'AnaTech Labs',
    images: [
      {
        url: 'https://anatechlabs.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AnaTech Labs – laboratory and environmental monitoring',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          poppins.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AIStateProvider>
            <WorkshopInquiryProvider>
              <UserInfoPopupProvider>
                <FirebaseClientProvider>
                  <AuthStateObserver />
                  <div className="relative flex min-h-dvh flex-col bg-background">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <WorkshopInquiryModal />
                  <UserInfoPopupModal />
                  <FirebaseErrorListener />
                </FirebaseClientProvider>
              </UserInfoPopupProvider>
            </WorkshopInquiryProvider>
          </AIStateProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
