import { AlertTriangle, Bell, CreditCard, CircleDollarSign, DollarSign, Home, Users, BarChart3, MessagesSquare, MessageSquareDot, UsersRound } from "lucide-react";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { renewTokens } from '../utils/RenewTokens';
import Cookies from 'js-cookie';
import { ProfileDropdown } from "../components/profile/ProfileDropdown"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import ProfilePhotoModal from "../components/ProfilePhotoModal"
import { PageLayout, Section, Header, Footer } from "../components/layout/PageLayout"
import ChatsContainer from "../components/chats/ChatsContainer";
import { getTotalUnreadCount } from "../components/chats/ChatNotifications";
import SettleUpModal from "./settleup";
import { PaymentModal } from "./newpayment";
import { SecurityUtils } from "../utils/Security";
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
      <CreditCard className="w-5 h-5" />
    </div>
    <span className="font-bold text-xl">CliquePay</span>
  </div>
)

function FriendCard({ name, imgSrc, owes, isOwed, amount }) {
  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-center p-4">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={imgSrc} alt={name} />
            <AvatarFallback className="bg-purple-900/50 text-white">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-white">{name}</h3>

          {isOwed ? (
            <div className="mt-2 text-green-400 font-medium">Owes you ${amount.toFixed(2)}</div>
          ) : (
            <div className="mt-2 text-red-400 font-medium">You owe ${owes.toFixed(2)}</div>
          )}

          <div className="mt-3 flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
              Remind
            </Button>
            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
              Pay
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  owes: PropTypes.number,
  isOwed: PropTypes.bool,
  amount: PropTypes.number
}


export default function Dashboard() {
  const navigate = useNavigate()
  const [billSummary, setBillSummary] = useState({
    totalBill: 0,
    youOwe: 0,
    theyOwe: 0,
  })
  const [showPaymentModalOpen, setShowPaymentModalOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([])
  const [friends, setFriends] = useState([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState("")
  const [groupChats, setGroupChats] = useState([]);
  const [directChats, setDirectChats] = useState([]);
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);
  const [settleUpDetails, setSettleUpDetails] = useState({ amount: 0, recipient: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // API URL from environment variable or fallback
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError("");
      
      // Get the user's ID token
      const idToken = await SecurityUtils.getCookie('idToken');
      if (!idToken) {
        throw new Error("Authentication required");
      }
      
      // Fetch expenses
      const response = await fetch(`${API_URL}/get-financial-summary/?idToken=${encodeURIComponent(idToken)}`);
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        // Update bill summary directly from the API
        setBillSummary(data.summary);
        // setRecentActivity(recentExpenses);
      } else {
        setError("Failed to load expenses data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    }
  };

  const handleSettleUp = (amount, recipient) => {
    setSettleUpDetails({ amount, recipient });
    setShowSettleUpModal(true);
  };

  const handlePaymentModalOpen = () => {
    setShowPaymentModalOpen(true);
  }

  const confirmSettleUp = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Success handling
      setShowSettleUpModal(false);
      // Refresh dashboard data after settling up
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to settle up:", error);
      // Add error handling here if needed
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRemind = async (activityId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log(`Reminder sent for activity ${activityId}`)
      // Could show a success message here
    } catch (error) {
      console.error("Failed to send reminder:", error)
    }
  }

  const refreshDashboardData = () => {
    fetchDashboardData();
  };

  const handleOpenGroupChat = (chatId) => {
    // Mark as read
    setGroupChats(groupChats.map(chat => 
      chat.id === chatId ? {...chat, unreadCount: 0} : chat
    ));
    
    // Here you would navigate to the chat or open a chat modal
    console.log(`Opening group chat ${chatId}`);
  };
  
  const handleOpenDirectChat = (chatId) => {
    // Mark as read
    setDirectChats(directChats.map(chat => 
      chat.id === chatId ? {...chat, unreadCount: 0} : chat
    ));
    
    // Here you would navigate to the chat or open a chat modal
    console.log(`Opening direct chat ${chatId}`);
  };

  const LogoutConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4 text-red-600">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-xl font-bold text-center mb-4">Logout</h3>
        <p className="text-gray-600 text-center mb-6">
        Are you sure you want to logout?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 py-2 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
  
  const handleFriendClick = () => {
    navigate('/friends');
  };

  const handleLogout = async() => {
    setIsLoggingOut(true);
    try {
      const checkTokens = await renewTokens();
      
      if(!checkTokens) {
        navigate('/login');
        return;
      }
      
      const accessToken = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken })
      });

      if(!response.ok) {
        throw new Error("Failed to logout");
      }

      // Clear cookies and navigate
      Cookies.remove('accessToken');
      Cookies.remove('idToken');
      Cookies.remove('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again later.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <PageLayout>
      {showLogoutModal && <LogoutConfirmationModal />}
      {showSettleUpModal && (
        <SettleUpModal
          amount={settleUpDetails.amount}
          recipient={settleUpDetails.recipient}
          onClose={() => setShowSettleUpModal(false)}
          onConfirm={confirmSettleUp}
          onSuccess={refreshDashboardData}
          setIsProcessing={setIsProcessingPayment}
          isProcessing={isProcessingPayment}
        />
      )}

      {
        showPaymentModalOpen && (
          <PaymentModal
          isOpen={showPaymentModalOpen}
          onClose={() => setShowPaymentModalOpen(false)}
          onSuccess={refreshDashboardData}  // Add this line
        />
        )
      }
      
      <Header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm py-4 relative z-[100]">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handlePaymentModalOpen(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Payment</span>
          </Button>
          <ProfileDropdown onLogout={() => setShowLogoutModal(true)} />
        </div>
      </Header>

        {/* Main Content */}
      <Section className="py-8">
        <Tabs defaultValue="dashboard" className="w-full relative z-10">
          <TabsList className="grid grid-cols-4 mb-8 bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="Chats" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white relative">
              {getTotalUnreadCount(groupChats, directChats) > 0 ? (
                <MessageSquareDot className="h-4 w-4 mr-2 text-purple-400" />
              ) : (
                <MessagesSquare className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Chats</span>
              {getTotalUnreadCount(groupChats, directChats) > 0 && (
                <span className="absolute -top-1 right-0 bg-purple-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
                  {getTotalUnreadCount(groupChats, directChats)}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Bill Summary</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 mb-1">Total Bill</p>
                      <p className="text-3xl font-bold text-white">${billSummary.totalBill.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => handleSettleUp(billSummary.youOwe, "friends")} className="bg-purple-600 hover:bg-purple-700">
                      Settle Up
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardContent className="p-4">
                        <p className="text-gray-400 text-sm">You Owe</p>
                        <p className="text-2xl font-bold text-red-400">${billSummary.youOwe.toFixed(2)}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardContent className="p-4">
                        <p className="text-gray-400 text-sm">They Owe You</p>
                        <p className="text-2xl font-bold text-green-400">${billSummary.theyOwe.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <Link to="/transactions" className="text-purple-400 hover:text-purple-300 text-sm">
                  View All
                </Link>
              </div>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-0">
                  <ul className="divide-y divide-zinc-800">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="p-4 flex justify-between items-start">
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-white">{activity.description}</p>
                          <p className="text-sm text-gray-400">{activity.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-red-400">-${activity.amount.toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemind(activity.id)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-zinc-800"
                          >
                            Remind
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Friends</h2>
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0" onClick={handleFriendClick}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Friends
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.name}
                    name={friend.name}
                    imgSrc={friend.imgSrc}
                    owes={friend.owes}
                    isOwed={friend.isOwed}
                    amount={friend.amount || 0}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription className="text-gray-400">View and manage all your transactions here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Your transaction history will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription className="text-gray-400">Track your spending patterns and insights.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Your spending analytics will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Chats">
            <ChatsContainer 
              groupChats={groupChats}
              directChats={directChats}
              onOpenGroupChat={handleOpenGroupChat}
              onOpenDirectChat={handleOpenDirectChat}
            />
          </TabsContent>
        </Tabs>
      </Section>

      <Footer className="border-t border-zinc-800 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} CliquePay. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </Footer>
    </PageLayout>
  )
}

