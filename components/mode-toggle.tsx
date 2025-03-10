"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Zap, Leaf, Binary } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const {  setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 theme-bio-dark:rotate-90 theme-bio-dark:scale-0 theme-cyberpunk:rotate-90 theme-cyberpunk:scale-0 theme-future:rotate-90 theme-future:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 theme-bio-dark:rotate-0 theme-bio-dark:scale-100 theme-cyberpunk:rotate-0 theme-cyberpunk:scale-100 theme-future:rotate-0 theme-future:scale-100" />
          <Leaf className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all theme-bio:rotate-0 theme-bio:scale-100" />
          <Leaf className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all theme-bio-dark:rotate-0 theme-bio-dark:scale-100 opacity-80" />
          <Zap className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all theme-cyberpunk:rotate-0 theme-cyberpunk:scale-100" />
          <Binary className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all theme-future:rotate-0 theme-future:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-bio")}>
          <Leaf className="mr-2 h-4 w-4" />
          <span>Bio Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-bio-dark")}>
          <Leaf className="mr-2 h-4 w-4 opacity-80" />
          <span>Bio Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-cyberpunk")}>
          <Zap className="mr-2 h-4 w-4" />
          <span>Cyberpunk (Dark)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-future")}>
          <Binary className="mr-2 h-4 w-4" />
          <span>Future (Dark)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 