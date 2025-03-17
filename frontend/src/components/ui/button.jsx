import * as React from "react"
import PropTypes from 'prop-types';
import { cn } from "../../lib/utils"
import { buttonVariants } from "./button-variants"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})

Button.displayName = "Button"

// TypeScript equivalent using JSDoc
/**
 * @typedef {Object} ButtonProps
 * @property {string} [className]
 * @property {'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'} [variant]
 * @property {'default'|'sm'|'lg'|'icon'} [size]
 * @property {boolean} [asChild]
 */
Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  asChild: PropTypes.bool,
};

export { Button }

