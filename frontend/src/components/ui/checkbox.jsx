import * as React from "react"
import PropTypes from "prop-types"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn("h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-600", className)}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"
Checkbox.propTypes = {
  className: PropTypes.string,
  // Add other props validation if needed
}

export { Checkbox }

