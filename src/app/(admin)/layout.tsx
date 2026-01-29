
'use client';

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Mail,
  FlaskConical,
  BookOpen,
  Building,
  ClipboardList,
  Tags,
  Truck,
  Package,
  PackageOpen,
  Wrench,
  BarChart3,
  LogOut,
  Shield,
  Bell,
  Newspaper,
  ShoppingBag,
  PackageSearch,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "Authentication service not available.",
        });
        setIsLoggingOut(false);
        return;
    }

    try {
        await signOut(auth);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.replace('/login');
    } catch (error) {
        console.error("Logout failed:", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: (error as Error).message || "An error occurred during logout. Please try again.",
        });
    } finally {
        setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    {
      group: 'CRM',
      items: [
        { href: '/admin/contacts', label: 'Contacts', icon: Mail },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/workshops', label: 'Workshop Requests', icon: FlaskConical },
      ],
    },
    {
      group: 'Marketing',
      items: [
        { href: '/admin/newsletter-subscribers', label: 'Newsletter', icon: Newspaper },
        { href: '/admin/notification-subscribers', label: 'Notifications', icon: Bell },
      ],
    },
    {
      group: 'Orders & Services',
      items: [
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/admin/order-services', label: 'Order Services', icon: Tags },
        { href: '/admin/services', label: 'Services Catalog', icon: Wrench },
        { href: '/admin/tracking-status', label: 'Tracking Status', icon: Truck },
      ],
    },
    {
      group: 'Sample Submission Portal (SSP)',
      items: [
        { href: '/admin/ssp/orders', label: 'SSP Orders', icon: Package },
        { href: '/admin/ssp/order-items', label: 'SSP Order Items', icon: PackageOpen },
        { href: '/admin/ssp/services', label: 'SSP Services', icon: Wrench },
        { href: '/admin/ssp/tracking-status', label: 'SSP Tracking', icon: PackageSearch },
      ],
    },
    {
        group: 'Admin',
        items: [
            { href: '/admin/users', label: 'User Info', icon: Users },
            { href: '/admin/job-applications', label: 'Job Applications', icon: Briefcase },
        ]
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <FlaskConical className="h-6 w-6 text-secondary" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">AnaTech Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {navItems.map((nav, index) =>
              nav.group ? (
                <SidebarGroup key={index}>
                  <SidebarMenu>
                    {nav.items.map(item => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild tooltip={item.label}>
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              ) : (
                <SidebarGroup key={index}>
                    <SidebarMenu>
                        <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={nav.label}>
                            <Link href={nav.href}>
                            <nav.icon />
                            <span>{nav.label}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
              )
            )}
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-background px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <span className="font-semibold hidden sm:inline">AnaTech Labs – Admin Dashboard</span>
              </div>
              {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                     <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                     >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                    </button>
                </div>
              )}
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
