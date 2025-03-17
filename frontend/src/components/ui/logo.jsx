import { CreditCard } from "lucide-react"
import { Link } from "react-router-dom" // Changed from Next.js Link

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
        <CreditCard className="w-5 h-5" />
      </div>
      <span className="font-bold text-xl">CliquePay</span>
    </Link>
  )
}

