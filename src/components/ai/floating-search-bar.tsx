'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAIState } from '@/lib/ai/context'
import { AISearchPanel } from './ai-search-panel'
import { cn } from '@/lib/utils'

export function FloatingSearchBar() {
  const { isSearchOpen, setIsSearchOpen } = useAIState()

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          aria-label="Toggle AI Search Assistant"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className={cn("h-6 w-6 stroke-black")} />
        </Button>
      </div>
      <AISearchPanel />
    </>
  )
}
