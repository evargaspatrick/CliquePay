import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { Mail, Phone, Calendar, DollarSign, Clock, ArrowLeft, RefreshCw, Camera, Edit, Trash2 } from "lucide-react"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const id_token = Cookies.get("idToken")
        if (!id_token) {
          navigate("/login")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/api/user-profile/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const data = await response.json()
        setUser(data.user_data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load user profile. Please try again later.")
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl text-white bg-blue-800">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-2xl text-white bg-blue-800">{error}</div>
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-white bg-blue-800">
        No user data available.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500 flex flex-col items-center p-8 font-sans">
      {/* Add navigation buttons */}
      <div className="w-full max-w-md flex justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-green-700 hover:text-green-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
      </div>

      {/* Profile section with hover effects */}
      <div className="flex flex-col items-center mb-8 group">
        <div className="relative">
          <img
            src={user.profile_photo || "/placeholder.svg?height=150&width=150"}
            className="w-36 h-36 rounded-full object-cover border-4 border-green-600 mb-4 shadow-xl 
                     transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-6 right-0 bg-green-600 p-2 rounded-full shadow-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{user.full_name}</h1>
        <p className="text-xl text-green-700">@{user.username}</p>
      </div>

      {/* Info cards with hover animations */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 w-full max-w-md shadow-xl 
                      transition-all duration-300 hover:shadow-2xl">
        <div className="grid gap-4">
          <InfoItem 
            icon={<Mail className="text-green-600" size={20} />} 
            text={user.email}
            label="Email"
          />
          <InfoItem 
            icon={<Phone className="text-green-600" size={20} />} 
            text={user.phone_number || "Not provided"}
            label="Phone"
          />
          <InfoItem
            icon={<DollarSign className="text-green-600" size={20} />}
            text={user.currency}
            label="Preferred Currency"
          />
          <InfoItem
            icon={<Calendar className="text-green-600" size={20} />}
            text={new Date(user.created_at).toLocaleDateString()}
            label="Joined"
          />
          <InfoItem
            icon={<Clock className="text-green-600" size={20} />}
            text={new Date(user.updated_at).toLocaleDateString()}
            label="Last Updated"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-6 flex gap-4">
        <button 
          onClick={() => navigate('/edit-profile')}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg
                   hover:bg-green-700 transition-colors shadow-lg"
        >
          <Edit className="w-5 h-5" />
          Edit Profile
        </button>
        <button 
          onClick={() => {/* Add delete confirmation logic */}}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg
                   hover:bg-red-700 transition-colors shadow-lg"
        >
          <Trash2 className="w-5 h-5" />
          Delete Profile
        </button>
      </div>
    </div>
  )
}

// Updated InfoItem component with labels and hover effects
const InfoItem = ({ icon, text, label }) => (
  <div className="flex items-center p-3 rounded-lg transition-colors hover:bg-green-50 group">
    <span className="mr-4 transition-transform group-hover:scale-110">{icon}</span>
    <div className="flex items-center">
      <span className="text-gray-500 mr-2">{label}:</span>
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  </div>
)

export default UserProfile