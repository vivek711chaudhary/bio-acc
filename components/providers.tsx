"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "theme-bio", "theme-bio-dark", "theme-cyberpunk", "theme-future"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 