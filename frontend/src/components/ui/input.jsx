import * as React from "react"
import PropTypes from "prop-types"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  props: PropTypes.object,
}

export { Input }

