'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAIState } from '@/lib/ai/context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CornerDownLeft, Loader, X, Navigation, Briefcase, FlaskConical, Edit, Phone, FileText } from 'lucide-react'
import { services } from '@/lib/data'
import { cn } from '@/lib/utils'

const TypingAnimation = () => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-muted-foreground">AI is thinking</span>
        <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce"></div>
      </div>
    )
}

export function AISearchPanel() {
  const { isSearchOpen, setIsSearchOpen } = useAIState()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<any | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus()
      // Reset state when opening
      setQuery('')
      setResponse(null)
      setIsThinking(false)
    }
  }, [isSearchOpen])
  
  // Mock function, as the AI flow does not exist
  const handleQuery = async (q: string) => {
    if (!q.trim()) return

    setIsThinking(true)
    setResponse(null)
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    setResponse({
        response: "AI assistant is not configured. Please use the quick links or navigate the site directly.",
        navigation: null,
        suggestions: [],
      });

    setIsThinking(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isThinking) return
    handleQuery(query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleQuery(suggestion);
  }

  const handleServiceNavigation = (value: string) => {
    if (value) {
      // The services page uses hash navigation
      const [path, hash] = value.split('#');
      router.push(`${path}#${hash}`);
      setIsSearchOpen(false);
    }
  };

  const quickLinks = [
    { label: "Our Projects", href: "/projects", icon: Navigation },
    { label: "SSP", href: "/services/sample-submission", icon: FileText },
    { label: "Careers", href: "/careers", icon: Briefcase },
    { label: "Workshops", href: "/resources/workshops", icon: FlaskConical },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-50 w-full max-w-md"
        >
          <div className="bg-card border rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about our services, labs, etc..."
                  className="w-full pr-10"
                  aria-label="AI Search Input"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  disabled={isThinking}
                  aria-label="Submit search"
                >
                  {isThinking ? <Loader className="animate-spin icon-glow-light dark:icon-glow-dark" /> : <CornerDownLeft className="icon-glow-light dark:icon-glow-dark"/>}
                </Button>
              </form>

              {/* Quick Links Section */}
              <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">JUMP TO:</p>
                  <div className="grid grid-cols-2 gap-2">
                     <Select onValueChange={handleServiceNavigation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Find Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/services#ohs">OHS</SelectItem>
                        <SelectItem value="/services#ehs">EHS</SelectItem>
                        <SelectItem value="/services#product-testing">Product Testing</SelectItem>
                      </SelectContent>
                    </Select>
                    {quickLinks.map(link => (
                        <Button key={link.href} variant="outline" size="sm" asChild className="justify-start">
                           <a href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); setIsSearchOpen(false); }}>
                                <link.icon className="mr-2 h-3.5 w-3.5"/>
                                {link.label}
                           </a>
                        </Button>
                    ))}
                  </div>
              </div>
            </div>
            
            {(isThinking || response) && (
              <div className="px-4 pb-4 border-t pt-4">
                {isThinking ? (
                  <TypingAnimation />
                ) : response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-foreground/90">{response.response}</p>
                    {response.suggestions && response.suggestions.length > 0 && (
                       <div>
                         <p className="text-xs text-muted-foreground mb-2">Suggested:</p>
                         <div className="flex flex-wrap gap-2">
                          {response.suggestions.map((item: string) => (
                            <Button key={item} size="sm" variant="secondary" onClick={() => handleSuggestionClick(item)}>
                              {item}
                            </Button>
                          ))}
                        </div>
                       </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
            
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              aria-label="Close search panel"
            >
              <X className="h-4 w-4 icon-glow-light dark:icon-glow-dark" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
