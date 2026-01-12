

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  GalleryHorizontal,
  HeartPulse,
  Home,
  Info,
  Mail,
  Menu,
  Newspaper,
  Phone,
  Rocket,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TestTubes,
  Users,
  Wind,
  Workflow,
  Wrench,
  FileText,
} from 'lucide-react';
import { SettingsPanel } from './settings-panel';
import { useState } from 'react';
import { useAIState } from '@/lib/ai/context';
import { FloatingSearchBar } from '../ai/floating-search-bar';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  {
    name: 'Services',
    href: '/services',
    icon: Wrench,
    children: [
      { name: 'OHS (Occupational Health)', href: '/services#ohs', icon: HeartPulse },
      { name: 'EHS (Environmental Health)', href: '/services#ehs', icon: Wind },
      { name: 'Product Testing and Certifications', href: '/services#product-testing', icon: TestTubes },
      { name: 'Sample Submission Portal', href: '/services/sample-submission', icon: FileText },
    ],
  },
  { name: 'Projects', href: '/projects', icon: Workflow },
  { name: 'Careers', href: '/careers', icon: Briefcase },
  {
    name: 'Resources',
    href: '#',
    icon: BookOpen,
    children: [
      {
        name: 'News / Blogs',
        href: '/resources/news',
        icon: Newspaper,
      },
      { name: 'CSR', href: '/resources/csr', icon: Sparkles },
      { name: 'Workshops', href: '/resources/workshops', icon: FlaskConical },
      { name: 'Training', href: '/training', icon: Award },
    ],
  },
  {
    name: 'About Us',
    href: '#',
    icon: Building2,
    children: [
      { name: 'Company Info', href: '/about/company-info', icon: Info },
      { name: 'Achievements', href: '/about/achievements', icon: Award },
      { name: 'Clients', href: '/about/clients', icon: Users },
      { name: 'Projects', href: '/projects', icon: Workflow },
      { name: 'Teams', href: '/about/teams', icon: Users },
      { name: 'Quality Policy', href: '/about/quality-policy', icon: ShieldCheck },
      { name: 'Reviews', href: '/about/reviews', icon: Star },
      {
        name: 'Gallery',
        href: '/about/gallery',
        icon: GalleryHorizontal,
      },
    ],
  },
  { name: 'Contact', href: '/contact', icon: Mail },
];

function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const pathname = usePathname();
  const { isAIEnabled } = useAIState();
  
  const isAdminPage = pathname.startsWith('/admin') || pathname === '/login';

  if (isAdminPage) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8 [padding-left:max(env(safe-area-inset-left),1.5rem)] [padding-right:max(env(safe-area-inset-right),1.5rem)]">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="https://image2url.com/images/1762929258972-a137849d-1725-4457-aaab-d3f2cd2f07a2.png" alt="AnaTech Logo" width={32} height={32} />
            <span className="font-bold font-display text-xl">AnaTech</span>
          </Link>
          <div className="hidden flex-1 md:flex">
            <DesktopNav pathname={pathname}/>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
             <Link href="/login" aria-label="Admin dashboard">
               <Button variant="ghost" size="icon">
                  <Shield className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
               </Button>
             </Link>
             <Button variant="ghost" size="icon" onClick={() => setSettingsPanelOpen(true)}>
               <Settings className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
               <span className="sr-only">Settings</span>
             </Button>
             <Sheet open={settingsPanelOpen} onOpenChange={setSettingsPanelOpen}>
                <SheetContent>
                    <SettingsPanel />
                </SheetContent>
             </Sheet>

            <Button asChild className="hidden md:inline-flex">
              <Link href="/contact">Request a Quote</Link>
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                 <MobileNav closeMenu={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {isAIEnabled && <FloatingSearchBar />}
    </>
  );
}

export function Header() {
    return <HeaderContent />;
}

function DesktopNav({pathname}: {pathname: string}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) =>
          item.children ? (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {item.children.map((child) => (
                    <ListItem
                      key={child.name}
                      title={child.name}
                      href={child.href}
                      icon={child.icon}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink asChild active={pathname === item.href}>
                <Link href={item.href} className={navigationMenuTriggerStyle()}>
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({ closeMenu }: { closeMenu: () => void }) {
  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <div className="flex h-full flex-col">
       <div className="border-b pb-4 pl-4 pr-6 pt-6">
        <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <Image src="https://image2url.com/images/1762929258972-a137849d-1725-4457-aaab-d3f2cd2f07a2.png" alt="AnaTech Logo" width={32} height={32} />
            <span className="font-bold font-display text-xl">AnaTech</span>
        </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
            {navItems.map((item) =>
            item.children ? (
                <AccordionItem value={item.name} key={item.name}>
                <AccordionTrigger className="pl-4 pr-2 text-base">
                    {item.name}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                    <ul className="flex flex-col">
                    {item.children.map((child) => (
                        <li key={child.name}>
                        <Link
                            href={child.href}
                            className="flex items-center gap-3 py-3 pl-12 pr-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={handleLinkClick}
                        >
                            {child.icon && <child.icon className="h-4 w-4 icon-glow-light dark:icon-glow-dark" />}
                            {child.name}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </AccordionContent>
                </AccordionItem>
            ) : (
                <Link
                key={item.name}
                href={item.href}
                className="flex items-center py-3 pl-4 pr-2 text-base font-medium border-b"
                onClick={handleLinkClick}
                >
                {item.name}
                </Link>
            )
            )}
        </Accordion>
        </div>
        <div className="mt-auto border-t p-4">
             <Button asChild className="w-full">
                <Link href="/contact" onClick={handleLinkClick}>Request a Quote</Link>
            </Button>
        </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-secondary icon-glow-light dark:icon-glow-dark" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

    