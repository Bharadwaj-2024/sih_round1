"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { type Language, languageNames } from "@/lib/i18n"
import { Globe, Check } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage, isLoaded } = useLanguage()

  // Show loading state while language preference is being loaded
  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled>
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {Object.entries(languageNames).map(([lang, name]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang as Language)}
            className={`flex items-center justify-between ${language === lang ? "bg-accent" : ""}`}
          >
            <span>{name}</span>
            {language === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
