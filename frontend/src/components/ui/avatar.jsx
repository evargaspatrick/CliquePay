import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import PropTypes from "prop-types"
import { cn } from "../../lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName
Avatar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  asChild: PropTypes.bool
}

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName
AvatarImage.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  onLoadingStatusChange: PropTypes.func
}

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-zinc-400", className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
AvatarFallback.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  asChild: PropTypes.bool,
  delayMs: PropTypes.number
}

export { Avatar, AvatarImage, AvatarFallback }

