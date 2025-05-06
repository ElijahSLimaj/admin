// src/components/ui/SidebarIcon.tsx
import React from "react"
import { cn } from "@/lib/utils"

interface SidebarIconProps {
  /** Pass the raw SVG element, e.g. <CreditCard /> */
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>
  /** Is the parent item active? */
  isActive: boolean
  /** Any extra classes you’d normally apply */
  className?: string
}

export function SidebarIcon({ icon, isActive, className }: SidebarIconProps) {
  // clone the SVG element and inject our classes
  return React.cloneElement(icon, {
    className: cn(
      "h-5 w-5 mr-3 flex-shrink-0",
      isActive ? "text-primary-foreground" : "text-muted-foreground",
      className
    )
  })
}
