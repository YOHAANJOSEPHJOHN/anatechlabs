
'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LabIcon } from '../icons';
import { Facebook, Linkedin, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { NewsletterForm } from '../newsletter-form';

const footerNavs = [
  {
    label: 'Services',
    items: [
      { href: '/services#ohs', name: 'OHS' },
      { href: '/services#ehs', name: 'EHS' },
      { href: '/services#product-testing', name: 'Product Testing' },
      { href: '/projects', name: 'Projects' },
      { href: '/about/quality-policy', name: 'Quality Policy' },
    ],
  },
  {
    label: 'About Us',
    items: [
      { href: '/about/company-info', name: 'Company' },
      { href: '/about/teams', name: 'Our Team' },
      { href: '/careers', name: 'Careers' },
      { href: '/resources/news', name: 'News & Updates' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { href: '/contact', name: 'Contact Us' },
      { href: '#faq', name: 'FAQ' }, // Assuming an FAQ section on homepage or a dedicated page
      { href: '/resources/workshops', name: 'Workshops' },
      { href: '/resources/csr', name: 'CSR' },
    ],
  },
];

const contactDetails = {
    phone: "9844163329",
    email: "contact@anatechlabs.com",
    address: "16, 18th A Cross Rd, 1st main, Bhuvaneswari Nagar, Hebbal Kempapura, Bengaluru, Byatarayanapura CMC and OG Part, Karnataka 560024"
}

const socialLinks = [
  { icon: <Twitter className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Linkedin className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Facebook className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Youtube className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container py-16">
        
        <div className="mb-16">
          <NewsletterForm />
        </div>

        {/* Top Navigation Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h3 className="font-semibold font-display">{nav.label}</h3>
                <ul className="mt-4 space-y-2">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-card-foreground/80 transition hover:text-secondary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
             <div>
                <h3 className="font-semibold font-display">Contact Us</h3>
                <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                        <Phone className={cn("h-5 w-5 text-secondary flex-shrink-0 mt-1", "icon-glow-light dark:icon-glow-dark")} />
                        <a href={`tel:${contactDetails.phone}`} className="text-card-foreground/80 transition hover:text-secondary">{contactDetails.phone}</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <Mail className={cn("h-5 w-5 text-secondary flex-shrink-0 mt-1", "icon-glow-light dark:icon-glow-dark")} />
                        <a href={`mailto:${contactDetails.email}`} className="text-card-foreground/80 transition hover:text-secondary">{contactDetails.email}</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPin className={cn("h-5 w-5 text-secondary flex-shrink-0 mt-1", "icon-glow-light dark:icon-glow-dark")} />
                        <p className="text-card-foreground/80">{contactDetails.address}</p>
                    </li>
                </ul>
             </div>
        </div>
        
        {/* Centered QR Code Section */}
        <div className="my-16 flex justify-center">
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className="glassmorphism-card w-full max-w-xs p-6 sm:p-8 text-center"
            >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Scan & Connect</h3>
                
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 inline-block p-2 bg-white/10 rounded-lg qr-glow-wrapper transition-all duration-300"
                >
                    <Image 
                        src="https://image2url.com/r2/bucket2/images/1767689807691-d33f5edd-2f63-4a6e-8355-347f672637ef.png"
                        alt="QR Code for Linktree"
                        width={128}
                        height={128}
                        className="mx-auto rounded-md"
                    />
                </motion.div>
                <Button 
                    asChild 
                    className="mt-6 w-full rounded-full bg-white/10 text-white/90 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:ring-white/30 hover:scale-105 cta-glow"
                >
                    <Link href="https://linktr.ee/yohan_josephx" target="_blank" rel="noopener noreferrer">
                        Click Me
                    </Link>
                </Button>
            </motion.div>
        </div>


        {/* Bottom Bar with Socials and Copyright */}
        <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
               <Link href="/" className="flex items-center space-x-2">
                <Image src="https://image2url.com/images/1762929258972-a137849d-1725-4457-aaab-d3f2cd2f07a2.png" alt="AnaTech Logo" width={24} height={24} />
                <span className="font-bold font-display text-lg">AnaTech</span>
              </Link>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <Link key={idx} href={social.href} className="text-card-foreground/70 hover:text-secondary transition-colors">
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="text-center sm:text-right">
                <p className="text-sm text-card-foreground/60">
                    &copy; {new Date().getFullYear()} AnaTech. All rights reserved.
                </p>
            </div>
        </div>
        <div className="text-center mt-8">
            <p className="text-sm text-card-foreground/60">
                Designed • Developed • Maintained by{' '}
                <a
                    href="https://www.linkedin.com/in/yohaan-joseph-john"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-card-foreground/80 hover:text-secondary hover:underline transition-all duration-300"
                >
                    Yohaan JJ
                </a>
            </p>
        </div>
      </div>
    </footer>
  );
}
