import { cn } from "@/lib/utils"
import bleed from "@/assets/bleed.png"

interface BackgroundImageProps {
  className?: string
}

export function BackgroundImage({ className }: BackgroundImageProps) {
  return (
    <div
      className={cn(
        // offset by sidebar width (20rem), span to right
        "fixed bottom-0 left-80 right-0 h-20 overflow-hidden pointer-events-none -z-10",
        className
      )}
    >
      <img
        src={bleed}
        alt=""
        className="absolute bottom--20 left-0 w-full h-auto"
      />
    </div>
  )
}
