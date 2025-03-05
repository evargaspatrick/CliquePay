import * as React from "react"
import { cn } from "../../lib/utils";
import PropTypes from 'prop-types';

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
))
Sidebar.displayName = "Sidebar"
Sidebar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-14 items-center px-4", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"
SidebarHeader.propTypes = {
  className: PropTypes.string
}

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"
SidebarContent.propTypes = {
  className: PropTypes.string
}

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-4", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"
SidebarFooter.propTypes = {
  className: PropTypes.string
}

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"
SidebarMenu.propTypes = {
  className: PropTypes.string
}

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"
SidebarMenuItem.propTypes = {
  className: PropTypes.string
}

const SidebarMenuButton = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent", className)}
    {...props}
  />
))
SidebarMenuButton.displayName = "SidebarMenuButton"
SidebarMenuButton.propTypes = {
  className: PropTypes.string
}

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("my-4 border-t border-border", className)} {...props} />
))
SidebarSeparator.displayName = "SidebarSeparator"
SidebarSeparator.propTypes = {
  className: PropTypes.string
}

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("absolute left-0 top-0 h-full w-1 bg-border transition-all", className)} {...props} />
))
SidebarRail.displayName = "SidebarRail"
SidebarRail.propTypes = {
  className: PropTypes.string
}

const SidebarProvider = ({ children }) => {
  return <>{children}</>
}
SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired
}

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent", className)}
    {...props}
  >
    <span className="sr-only">Toggle sidebar</span>
    {/* Menu icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
))
SidebarTrigger.displayName = "SidebarTrigger"
SidebarTrigger.propTypes = {
  className: PropTypes.string
}

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-1 flex-col overflow-hidden", className)} {...props} />
))
SidebarInset.displayName = "SidebarInset"
SidebarInset.propTypes = {
  className: PropTypes.string
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
}