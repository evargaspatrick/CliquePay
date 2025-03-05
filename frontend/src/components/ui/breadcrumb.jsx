import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import PropTypes from 'prop-types'

const Breadcrumb = React.forwardRef(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground", className)}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"
BreadcrumbList.propTypes = {
  className: PropTypes.string
}

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"
BreadcrumbItem.propTypes = {
  className: PropTypes.string
}

const BreadcrumbLink = React.forwardRef(({ className, ...props }, ref) => (
  <a ref={ref} className={cn("hover:text-foreground transition-colors", className)} {...props} />
))
BreadcrumbLink.displayName = "BreadcrumbLink"
BreadcrumbLink.propTypes = {
  className: PropTypes.string
}

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"
BreadcrumbPage.propTypes = {
  className: PropTypes.string
}

const BreadcrumbSeparator = ({ className, ...props }) => (
  <ChevronRight className={cn("h-4 w-4", className)} aria-hidden="true" {...props} />
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"
BreadcrumbSeparator.propTypes = {
  className: PropTypes.string
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }

