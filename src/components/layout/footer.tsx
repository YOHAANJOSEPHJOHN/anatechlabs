
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LabIcon } from '../icons';
import { Facebook, Linkedin, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

const footerNavs = [
  {
    label: 'Services',
    items: [
      { href: '/services#ohs', name: 'OHS' },
      { href: '/services#ems', name: 'EMS' },
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
    email: "contact@anatech.com",
    address: "16, 18th A Cross Rd, 1st main, Bhuvaneswari Nagar, Hebbal Kempapura, Bengaluru, Byatarayanapura CMC and OG Part, Karnataka 560024"
}

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  { icon: <Facebook className="h-5 w-5" />, href: '#' },
  { icon: <Youtube className="h-5 w-5" />, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="https://image2url.com/images/1762929258972-a137849d-1725-4457-aaab-d3f2cd2f07a2.png" alt="AnaTech Logo" width={32} height={32} />
              <span className="font-bold font-display text-2xl">AnaTech</span>
            </Link>
            <p className="mt-4 max-w-sm text-card-foreground/80">
              Your Partner in Precision Testing for a Sustainable & Safer Tomorrow
            </p>
            <div className="mt-6">
              <h3 className="font-semibold">Subscribe to our newsletter</h3>
              <form className="mt-2 flex gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-1" />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-9">
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
                        <Phone className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                        <a href={`tel:${contactDetails.phone}`} className="text-card-foreground/80 transition hover:text-secondary">{contactDetails.phone}</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                        <a href={`mailto:${contactDetails.email}`} className="text-card-foreground/80 transition hover:text-secondary">{contactDetails.email}</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                        <p className="text-card-foreground/80">{contactDetails.address}</p>
                    </li>
                </ul>
             </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
           <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link key={idx} href={social.href} className="text-card-foreground/70 hover:text-secondary transition-colors">
                  {social.icon}
                </Link>
              ))}
            </div>
          <p className="text-sm text-card-foreground/60">
            &copy; {new Date().getFullYear()} AnaTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
