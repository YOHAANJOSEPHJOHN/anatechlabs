
'use client';

import { useState, useEffect } from "react"
import { Moon, Sun, Shield, LogIn, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { useAIState } from "@/lib/ai/context"
import { BellIcon, CsrAnnouncementsIcon, NewsletterIcon, ShieldIcon, WorkshopUpdatesIcon } from "../icons"
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useWorkshopInquiry } from "@/hooks/use-workshop-inquiry";
import { useUserInfoPopup } from "@/hooks/use-user-info-popup";
import Link from "next/link";


function NotificationPreferencesPanel() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    workshopUpdates: false,
    csrAnnouncements: false,
    newsletter: false,
  });
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch('/api/notifications/preferences');
        const data = await response.json();
        if (response.ok) {
          setPreferences(data.preferences || { workshopUpdates: false, csrAnnouncements: false, newsletter: false });
          setEmail(data.email || '');
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch preferences.');
          // If no user info is stored, we can't get preferences
          if (response.status === 404) {
            setError('Please submit your info via the popup to manage notifications.');
          }
        }
      } catch (e) {
        setError('An error occurred while fetching your settings.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
    const originalPreferences = { ...preferences };
    setPreferences(prev => ({ ...prev, [key]: value }));

    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, [key]: value }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update setting.');
      }
      
      toast({
        title: "Preferences Updated",
        description: "Your notification settings have been saved.",
      });

    } catch (error) {
      setPreferences(originalPreferences); // Revert on failure
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: (error as Error).message || "Could not save your preferences.",
      });
    }
  };
  
  if (error) {
    return (
        <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">{error}</div>
    );
  }

  if (isLoading) {
    return (
        <div className="rounded-lg border p-3 space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn(
          "w-full text-left group rounded-lg border p-3 transition-colors hover:bg-muted"
        )}>
          <div className="flex items-start gap-3">
            <div className="mt-1">
                <BellIcon className="h-5 w-5 text-foreground icon-glow-light dark:icon-glow-dark" />
            </div>
            <div className="flex-1">
              <Label className="flex flex-col space-y-1 cursor-pointer">
                <span>Notification Preferences</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Manage your email subscriptions.
                </span>
              </Label>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your email subscriptions for {email}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                    <WorkshopUpdatesIcon className="h-5 w-5"/>
                    <Label htmlFor="workshop-updates">Workshop Updates</Label>
                </div>
                <Switch 
                    id="workshop-updates" 
                    checked={preferences.workshopUpdates}
                    onCheckedChange={(value) => handlePreferenceChange('workshopUpdates', value)}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                    <CsrAnnouncementsIcon className="h-5 w-5"/>
                    <Label htmlFor="csr-announcements">CSR Announcements</Label>
                </div>
                <Switch 
                    id="csr-announcements" 
                    checked={preferences.csrAnnouncements}
                    onCheckedChange={(value) => handlePreferenceChange('csrAnnouncements', value)}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                    <NewsletterIcon className="h-5 w-5"/>
                    <Label htmlFor="newsletter">Blog/Newsletter</Label>
                </div>
                <Switch 
                    id="newsletter" 
                    checked={preferences.newsletter}
                    onCheckedChange={(value) => handlePreferenceChange('newsletter', value)}
                />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PrivacyDataPanel() {
  const { toast } = useToast();

  const handleRequestDataRemoval = () => {
    // In a real app, this would trigger a backend process.
    toast({
      title: "Data Removal Requested",
      description: "Our team will process your request and contact you via email.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn(
          "w-full text-left group rounded-lg border p-3 transition-colors hover:bg-muted"
        )}>
          <div className="flex items-start gap-3">
            <div className="mt-1">
                <ShieldIcon className="h-5 w-5 text-foreground icon-glow-light dark:icon-glow-dark" />
            </div>
            <div className="flex-1">
              <Label className="flex flex-col space-y-1 cursor-pointer">
                <span>Privacy & Data Usage</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Review our data policies and manage your data.
                </span>
              </Label>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
            Privacy & Data Usage Center
          </DialogTitle>
          <DialogDescription>
            Your trust is important to us. Here's an overview of how we handle your data.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-h-[40vh] overflow-y-auto pr-4">
          <h4>Data Collection Policies</h4>
          <p>
            When you use our forms (Contact, Careers, Workshops), we collect the information you provide (e.g., name, email, resume) solely for the purpose of responding to your inquiry or processing your application. We do not sell or share this personal data with third parties for marketing purposes.
          </p>
          <h4>Cookie Use</h4>
          <p>
            Our website uses essential cookies to ensure basic functionality, like theme preferences and session management for logged-in admins. We do not use tracking or advertising cookies.
          </p>
          <h4>Client Confidentiality</h4>
          <p>
            All data related to client projects, including test results and reports, is treated with the strictest confidentiality. Access is restricted to authorized personnel involved in the project. We adhere to non-disclosure agreements and industry best practices to protect your intellectual property.
          </p>
        </div>
        <DialogFooter className="!justify-between sm:!justify-between gap-2">
          <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled>View Full Policy</Button>
            <DialogClose asChild>
                <Button type="button" onClick={handleRequestDataRemoval}>Request Data Removal</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function SettingsPanel() {
  const { setTheme, theme } = useTheme()
  const { isAIEnabled, setIsAIEnabled } = useAIState();
  const { popupsEnabled, setPopupsEnabled } = useWorkshopInquiry();
  const { userInfoPopupsEnabled, setUserInfoPopupsEnabled } = useUserInfoPopup();

  // The concept of an "admin" is now determined server-side by the session,
  // so we can't reliably check it here on the client for UI purposes without a session context.
  // The admin link will just be shown. If a non-admin clicks it, middleware will redirect them.

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
      </SheetHeader>
      <div className="py-4">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Theme</h4>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="w-full"
              >
                <Sun className="mr-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="w-full"
              >
                <Moon className="mr-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" /> Dark
              </Button>
            </div>
          </div>
          
           <div>
            <h4 className="text-sm font-medium mb-2">Notifications</h4>
            <NotificationPreferencesPanel />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Accessibility</h4>
            <div className="rounded-lg border p-3 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-search-toggle" className="flex flex-col space-y-1">
                  <span>Enable AI Search Assistant</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Use AI to help you navigate the site.
                  </span>
                </Label>
                <Switch 
                  id="ai-search-toggle"
                  checked={isAIEnabled}
                  onCheckedChange={setIsAIEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="workshop-popup-toggle" className="flex flex-col space-y-1">
                  <span>Enable Workshop Pop-Ups</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Turn on workshop notifications and guidance pop-ups across the site.
                  </span>
                </Label>
                <Switch 
                  id="workshop-popup-toggle"
                  checked={popupsEnabled}
                  onCheckedChange={setPopupsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="user-info-popup-toggle" className="flex flex-col space-y-1">
                  <span>Enable User Info Pop-Ups</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow the site to show a quick form asking for your basic details.
                  </span>
                </Label>
                <Switch 
                  id="user-info-popup-toggle"
                  checked={userInfoPopupsEnabled}
                  onCheckedChange={setUserInfoPopupsEnabled}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Privacy</h4>
            <PrivacyDataPanel />
          </div>

        </div>
      </div>
    </SheetContent>
  )
}
