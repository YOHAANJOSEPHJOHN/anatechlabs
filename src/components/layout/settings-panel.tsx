"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth, useFirestore, useUser } from "@/firebase";

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

type NotificationPreferences = {
  workshopUpdates: boolean;
  csrAnnouncements: boolean;
  newsletter: boolean;
};

const defaultPreferences: NotificationPreferences = {
  workshopUpdates: false,
  csrAnnouncements: false,
  newsletter: false,
};

function NotificationPreferencesPanel() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPreferences() {
      if (!user || !firestore) return;
      setIsLoading(true);
      const docRef = doc(firestore, "notification_subscribers", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferences(docSnap.data() as NotificationPreferences);
        } else {
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isUserLoading) {
      fetchPreferences();
    }
  }, [user, firestore, isUserLoading]);

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "You must be signed in to change notification preferences.",
      });
      return;
    }

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const docRef = doc(firestore, "notification_subscribers", user.uid);
    try {
      await setDoc(docRef, { ...newPreferences, email: user.email, updatedAt: serverTimestamp() }, { merge: true });
      toast({
        title: "Preferences Updated",
        description: `You have successfully updated your notification preferences.`,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your preferences. Please try again.",
      });
      // Revert optimistic update on failure
      setPreferences(preferences);
    }
  };
  
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <BellIcon className="h-5 w-5 text-foreground transition-transform group-hover:animate-bounce icon-glow-light dark:icon-glow-dark" />
        </div>
        <div className="flex-1">
          <Label htmlFor="notification-panel" className="flex flex-col space-y-1">
            <span>Notification Preferences</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Manage your email subscriptions.
            </span>
          </Label>
          <div className="mt-4 space-y-3 pr-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="workshop-updates" className="flex items-center gap-2 text-sm font-normal">
                <WorkshopUpdatesIcon className="h-4 w-4 text-muted-foreground" />
                Workshop Updates
              </Label>
              <Switch
                id="workshop-updates"
                checked={preferences.workshopUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('workshopUpdates', checked)}
                disabled={isUserLoading || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="csr-announcements" className="flex items-center gap-2 text-sm font-normal">
                <CsrAnnouncementsIcon className="h-4 w-4 text-muted-foreground" />
                CSR Announcements
              </Label>
              <Switch
                id="csr-announcements"
                checked={preferences.csrAnnouncements}
                onCheckedChange={(checked) => handlePreferenceChange('csrAnnouncements', checked)}
                disabled={isUserLoading || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter" className="flex items-center gap-2 text-sm font-normal">
                <NewsletterIcon className="h-4 w-4 text-muted-foreground" />
                Blog/Newsletter
              </Label>
              <Switch
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
                disabled={isUserLoading || isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
            Our website uses essential cookies to ensure basic functionality, like theme preferences. We do not use tracking or advertising cookies.
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
            <h4 className="text-sm font-medium mb-2">Notifications</h4>
            <NotificationPreferencesPanel />
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
