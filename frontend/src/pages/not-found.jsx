"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Home, Search } from "lucide-react"
import { Button } from "../components/ui/button";
import { Logo } from "../components/ui/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Error Code Animation */}
          <div className="relative h-48 mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-[10rem] font-bold text-zinc-800">404</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-12 relative"
          >
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-600 rounded-full"></div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2"
            >
              <Link to="/login">
                <ArrowLeft className="w-4 h-4" />
                Go to Login
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} CliquePay. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

