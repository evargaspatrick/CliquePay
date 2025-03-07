import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import PropTypes from "prop-types"
import { cn } from "../../lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
DropdownMenu.propTypes = {
  children: PropTypes.node,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  modal: PropTypes.bool
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
DropdownMenuTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool
}

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 p-1 text-white shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
DropdownMenuContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
  children: PropTypes.node,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  alignOffset: PropTypes.number,
  avoidCollisions: PropTypes.bool,
  collisionBoundary: PropTypes.any,
  collisionPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  sticky: PropTypes.oneOf(['partial', 'always']),
  hideWhenDetached: PropTypes.bool
}

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-700 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName
DropdownMenuItem.propTypes = {
  className: PropTypes.string,
  inset: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  textValue: PropTypes.string
}

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName
DropdownMenuLabel.propTypes = {
  className: PropTypes.string,
  inset: PropTypes.bool,
  children: PropTypes.node,
  asChild: PropTypes.bool
}

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-zinc-700", className)} {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName
DropdownMenuSeparator.propTypes = {
  className: PropTypes.string,
  asChild: PropTypes.bool
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}

