"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type Translations, translations } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      try {
        // Check for stored language preference
        const storedLanguage = localStorage.getItem("civicconnect_language") as Language
        if (storedLanguage && translations[storedLanguage]) {
          setLanguageState(storedLanguage)
        }
      } catch (error) {
        console.warn("Error accessing localStorage for language preference:", error)
      }
      setIsLoaded(true)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang)
      // Only access localStorage if we're in the browser
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("civicconnect_language", lang)
        } catch (error) {
          console.warn("Error saving language preference to localStorage:", error)
        }
      }
    } else {
      console.warn(`Language "${lang}" is not supported`)
    }
  }

  const t = translations[language]

  const value = {
    language,
    setLanguage,
    t,
    isLoaded
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
