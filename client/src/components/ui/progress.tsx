"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type PrimitiveProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

interface ProgressProps extends Omit<PrimitiveProps, 'value'> {
  /** Current progress value (0–100) */
  value: number
  /** Tailwind classes for the un-filled track */
  trackClassName?: string
  /** Tailwind classes for the filled portion */
  indicatorClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ value, className, trackClassName, indicatorClassName, ...props }, ref) => {
  // Ensure value is within 0–100
  const pct = Math.min(100, Math.max(0, value))

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={pct}
      className={cn(
        "relative w-full overflow-hidden rounded-full",
        trackClassName ?? "bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full transition-all",
          indicatorClassName ?? "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
