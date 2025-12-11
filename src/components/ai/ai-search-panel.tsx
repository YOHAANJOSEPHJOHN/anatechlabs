'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAIState } from '@/lib/ai/context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CornerDownLeft, Loader, X } from 'lucide-react'
import { services } from '@/lib/data'
import { cn } from '@/lib/utils'

interface AIResponse {
  type: 'navigation' | 'list' | 'scroll' | 'text' | 'error';
  content: any;
  message?: string;
}

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
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus()
    }
  }, [isSearchOpen])

  const handleQuery = (q: string) => {
    setIsThinking(true)
    setResponse(null)

    // Simulate AI processing
    setTimeout(() => {
      const lowerCaseQuery = q.toLowerCase()
      let res: AIResponse | null = null

      if (lowerCaseQuery.includes('service')) {
        res = { type: 'list', content: { title: 'Services', items: ['OHS', 'EMS'] }, message: "Here are our service categories:" }
      } else if (lowerCaseQuery.includes('ohs section')) {
        res = { type: 'scroll', content: '#ohs', message: "Scrolling to the OHS section for you." }
        if(window.location.pathname !== '/services') router.push('/services')
      } else if (lowerCaseQuery.includes('ohs lab')) {
        res = { type: 'list', content: { title: 'OHS Labs', items: services.filter(s => s.category === 'OHS').map(s => s.title) }, message: "Here are the OHS labs:" }
      } else if (lowerCaseQuery.includes('ems lab')) {
        res = { type: 'list', content: { title: 'EMS Labs', items: services.filter(s => s.category === 'EMS').map(s => s.title) }, message: "Here are the EMS labs:" }
      } else if (lowerCaseQuery.includes('project')) {
        res = { type: 'navigation', content: '/projects', message: "Navigating to the projects page." }
      } else if (lowerCaseQuery.includes('career')) {
        res = { type: 'navigation', content: '/careers', message: "Navigating to the careers page." }
      } else if (lowerCaseQuery.includes('workshop')) {
        res = { type: 'navigation', content: '/resources/workshops', message: "Navigating to the workshops page." }
      } else {
        res = { type: 'error', content: null, message: "Sorry, I can't help with that. Please try a different query." }
      }
      
      setResponse(res)
      setIsThinking(false)

      if (res.type === 'navigation') {
        router.push(res.content)
        setIsSearchOpen(false)
      }
      if (res.type === 'scroll') {
        const element = document.getElementById(res.content.substring(1))
        element?.scrollIntoView({ behavior: 'smooth' })
        // A small delay to allow scroll before panel closes
        setTimeout(() => setIsSearchOpen(false), 1000)
      }
    }, 1500)
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

  const suggestions = [
    "Find services",
    "Show OHS labs",
    "Show projects",
    "Find workshop info",
  ]
  
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
            <div className="p-4">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
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
            </div>
            
            {(isThinking || response) && (
              <div className="px-4 pb-4">
                {isThinking ? (
                  <TypingAnimation />
                ) : response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm text-muted-foreground mb-2">{response.message}</p>
                    {response.type === 'list' && (
                      <div className="flex flex-wrap gap-2">
                        {response.content.items.map((item: string) => (
                          <div key={item} className="bg-background border rounded-md px-3 py-1.5 text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                     {response.type === 'error' && (
                        <p className="text-destructive text-sm font-medium">{response.message}</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {!isThinking && !response && (
                 <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground mb-2">Try one of these:</p>
                    <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                        <Button key={s} size="sm" variant="outline" onClick={() => handleSuggestionClick(s)}>{s}</Button>
                    ))}
                    </div>
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
