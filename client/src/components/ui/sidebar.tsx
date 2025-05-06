import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface SidebarContextProps {
  isOpen: boolean
  toggle: () => void
  isMobile: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

interface SidebarProviderProps {
  defaultOpen?: boolean
  children: React.ReactNode
}

export function SidebarProvider({
  defaultOpen = false,
  children,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(defaultOpen)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [defaultOpen])

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, isMobile, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ className, open, onOpenChange, ...props }: SidebarProps) {
  const { isOpen, isMobile, setIsOpen } = useSidebar()

  // Sync the controlled state with context if provided
  React.useEffect(() => {
    if (open !== undefined && open !== isOpen) {
      setIsOpen(open)
    }
  }, [open, isOpen, setIsOpen])

  // Notify parent of changes
  React.useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen)
    }
  }, [isOpen, onOpenChange])

  return (
    <aside
      className={cn(
        "h-screen flex-shrink-0 flex flex-col overflow-hidden z-20 bg-background transition-all duration-300 ease-in-out",
        isOpen
          ? "w-80 translate-x-0"
          : isMobile
            ? "-translate-x-full w-80"
            : "w-20 translate-x-0",
        className
      )}
      {...props}
    />
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn(
        "w-full flex items-center h-16",
        isOpen ? "justify-between px-4" : "justify-center px-0",
        className
      )}
      {...props}
    />
  )
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function SidebarTrigger({ className, onClick, ...props }: SidebarTriggerProps) {
  const { toggle } = useSidebar()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggle()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn("p-2 rounded-md hover:bg-accent", className)}
      {...props}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <div className={cn("py-2", className)} {...props} />
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <div className={cn("py-1", className)} {...props} />
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  tooltip?: string
  className?: string
}

export function SidebarMenuButton({
  isActive = false,
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isOpen } = useSidebar()

  return (
    <button
      data-tooltip-content={tooltip}
      data-tooltip-id="sidebar-tooltip"
      className={cn(
        "relative group flex items-center rounded-md p-2 w-full transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}


interface SidebarMenuBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <span
      className={cn(
        "ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium leading-none text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

interface SidebarMenuActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function SidebarMenuAction({ className, ...props }: SidebarMenuActionProps) {
  return (
    <button
      className={cn(
        "ml-auto rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return <div className={cn("pl-8 mt-2", className)} {...props} />
}

interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return <div className={cn("py-1", className)} {...props} />
}

interface SidebarMenuSubButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  className?: string
}

export function SidebarMenuSubButton({
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  return (
    <button
      className={cn(
        "relative group flex items-center rounded-md p-1.5 text-sm w-full transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}


interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        isOpen && isMobile ? "ml-0" : !isOpen && !isMobile ? "ml-20" : "ml-0",
        className
      )}
      {...props}
    />
  )
}

interface SidebarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSkeleton() {
  return (
    <div className="flex items-center space-x-2 py-1">
      <div className="h-4 w-4 rounded-full bg-muted" />
      <div className="h-4 w-24 rounded bg-muted" />
    </div>
  )
}

export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 pt-4 pb-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarGroupAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "ml-auto rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-3 my-2 h-px bg-border", className)}
      {...props}
    />
  )
}