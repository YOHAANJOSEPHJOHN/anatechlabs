

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
import Script from 'next/script';

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
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
                <div className="relative flex min-h-dvh flex-col bg-background">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <WorkshopInquiryModal />
                <UserInfoPopupModal />
              </UserInfoPopupProvider>
            </WorkshopInquiryProvider>
          </AIStateProvider>
          <Toaster />
        </ThemeProvider>
        <script type="module" dangerouslySetInnerHTML={{ __html: `
          import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

          const canvas = document.getElementById('anatech-canvas');
          if (canvas) {
            // Scene
            const scene = new THREE.Scene();

            // Camera
            const camera = new THREE.PerspectiveCamera(
              45,
              window.innerWidth / window.innerHeight,
              0.1,
              100
            );
            camera.position.z = 8;

            // Renderer
            const renderer = new THREE.WebGLRenderer({
              canvas,
              alpha: true,
              antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Lighting (luxury-grade)
            scene.add(new THREE.AmbientLight(0x88ccff, 0.4));

            const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.2);
            rimLight.position.set(5, 5, 5);
            scene.add(rimLight);

            // Central abstract core
            const coreGeometry = new THREE.IcosahedronGeometry(1.6, 2);
            const coreMaterial = new THREE.MeshPhysicalMaterial({
              color: 0x0b2a3a,
              transmission: 0.6,
              roughness: 0.2,
              thickness: 1.5,
              emissive: 0x00e5ff,
              emissiveIntensity: 0.15
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(core);

            // Orbital ribbons
            const rings = [];
            for (let i = 0; i < 3; i++) {
              const ringGeometry = new THREE.TorusGeometry(3, 0.03, 16, 200);
              const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0x00e5ff,
                emissive: 0x00e5ff,
                emissiveIntensity: 1
              });

              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotation.x = Math.random() * Math.PI;
              ring.rotation.y = Math.random() * Math.PI;
              rings.push(ring);
              scene.add(ring);
            }

            // Mouse interaction
            let mouseX = 0;
            let mouseY = 0;
            window.addEventListener('mousemove', (e) => {
              mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
              mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            // Animate
            function animate() {
              core.rotation.y += 0.002;
              core.rotation.x += 0.001;

              rings.forEach((ring, i) => {
                ring.rotation.z += 0.002 + i * 0.001;
              });

              // Parallax
              core.rotation.y += mouseX * 0.002;
              core.rotation.x += mouseY * 0.002;

              renderer.render(scene, camera);
              requestAnimationFrame(animate);
            }
            animate();

            // Resize handling
            window.addEventListener('resize', () => {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(window.innerWidth, window.innerHeight);
            });
          }
        `}} />
      </body>
    </html>
  );
}


