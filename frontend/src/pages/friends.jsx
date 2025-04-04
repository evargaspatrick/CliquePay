import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add PropTypes import at the top
import { useUser } from '../utils/UserContext'
// import AuthenticateUser from '../utils/AuthenticateUser';
import { PageLayout, Section, Header } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import Loading from '../components/Loading';
// import { SecurityUtils } from '../utils/security'; // Comment out SecurityUtils
import { Users, UserPlus, Search, CreditCard, ArrowLeft, LogOut } from "lucide-react";
import FriendCard from '../components/ui/friends/FriendCard';
import RequestCard from '../components/ui/friends/RequestCard';
import SearchCard from '../components/ui/friends/SearchCard';
import SearchBar from '../components/ui/SearchBar';

// Enhanced scrollbar styles for better visibility
const scrollbarStyles = `
  /* Always show scrollbar */
  .custom-scrollbar {
    overflow-y: scroll !important;
    scrollbar-width: thin; /* Firefox */
  }
  
  /* Main scrollbar styling */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px !important;
    display: block !important;
  }
  
  /* Track styling - darker background */
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(39, 39, 42, 0.8) !important;
    border-radius: 4px !important;
    margin: 2px !important;
  }
  
  /* Thumb styling - brand purple to match buttons */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #9333EA !important; /* purple-600 to match buttons */
    border-radius: 4px !important;
    border: 1px solid #27272a !important;
    box-shadow: 0 0 3px rgba(147, 51, 234, 0.5) !important;
  }
  
  /* Hover effect - match button hover state */
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #7E22CE !important; /* purple-700 to match button hover */
  }
  
  /* Height constraint to force scrolling */
  .limit-height {
    max-height: 440px !important; 
    min-height: 440px !important;
  }
`;

// DUMMY DATA
const MOCK_PROFILE = {
  username: "johndoe",
  email: "john.doe@example.com",
  profile_photo: "https://randomuser.me/api/portraits/men/1.jpg"
};

const MOCK_FRIENDS = [
    {
        friend_id: "1",
        friend_name: "Alice Johnson",
        email: "alice.johnson@example.com",
        profile_photo: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
        friend_id: "2",
        friend_name: "Bob Smith",
        email: "bob.smith@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
        friend_id: "3",
        friend_name: "Carol Williams",
        email: "carol.williams@example.com", 
        profile_photo: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        friend_id: "4",
        friend_name: "David Brown",
        email: "david.brown@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        friend_id: "5",
        friend_name: "Emma Davis",
        email: "emma.davis@example.com",
        profile_photo: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
        friend_id: "6", 
        friend_name: "Frank Miller",
        email: "frank.miller@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
        friend_id: "7",
        friend_name: "Grace Wilson",
        email: "grace.wilson@example.com",
        profile_photo: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        friend_id: "8",
        friend_name: "Henry Taylor",
        email: "henry.taylor@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
        friend_id: "9",
        friend_name: "Isabella Martin",
        email: "isabella.martin@example.com",
        profile_photo: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
        friend_id: "10",
        friend_name: "James Anderson",
        email: "james.anderson@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
        friend_id: "11",
        friend_name: "Katherine Moore",
        email: "katherine.moore@example.com",
        profile_photo: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
        friend_id: "12",
        friend_name: "Liam Thompson",
        email: "liam.thompson@example.com",
        profile_photo: "https://randomuser.me/api/portraits/men/7.jpg"
    }
];

const MOCK_REQUESTS = [
  {
    friend_id: "5",
    friend_name: "Emma Davis",
    email: "emma.davis@example.com",
    profile_photo: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    friend_id: "6",
    friend_name: "Frank Miller",
    email: "frank.miller@example.com",
    profile_photo: "https://randomuser.me/api/portraits/men/4.jpg"
  }
];

const MOCK_SEARCH_RESULTS = [
  {
    id: "7",
    full_name: "Grace Wilson",
    username: "gracew",
    profile_photo: "https://randomuser.me/api/portraits/women/4.jpg",
    is_friend: false
  },
  {
    id: "8",
    full_name: "Henry Taylor",
    username: "henryt",
    profile_photo: "https://randomuser.me/api/portraits/men/5.jpg", 
    is_friend: false
  }
];

// Simple Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
      <CreditCard className="w-5 h-5" />
    </div>
    <span className="font-bold text-xl">CliquePay</span>
  </div>
)

Logo.propTypes = {
  // No props to validate
};

const Content = () => {
    // const user = useUser() // Comment out if causing issues
    const navigate = useNavigate();
    
    // Replace state initialization with dummy data
    const [profileData, setProfileData] = useState(MOCK_PROFILE);
    const [loading, setIsLoading] = useState(false); // Set to false to skip loading
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState(MOCK_FRIENDS);
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [blocked, setBlocked] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [requestedUsers, setRequestedUsers] = useState([]);

    // Comment out fetchUserProfile call and related useEffects
    /*
    useEffect(() => {
        fetchUserProfile();
    }, []);
    
    useEffect(() => {
        sortFriendships(allUsers);
    }, [allUsers]);
    */

    // Simplified mock search handler
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        
        setHasSearched(true);
        
        // Filter mock data based on search term
        const filteredResults = MOCK_SEARCH_RESULTS.filter(user => 
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    // Simplified mock handlers
    const handleRequest = (username) => {
        setRequestedUsers(prev => [...prev, username]);
        console.log(`Friend request sent to ${username}`);
    };

    const handleRemoveFriend = (id) => {
      setFriends(friends.filter(friend => friend.friend_id !== id));
    };

    const handleAcceptRequest = (id) => {
      const accepted = requests.find(req => req.friend_id === id);
      if (accepted) {
        setFriends([...friends, accepted]);
        setRequests(requests.filter(req => req.friend_id !== id));
      }
    };

    const handleDeclineRequest = (id) => {
      setRequests(requests.filter(req => req.friend_id !== id));
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (error) {
        return (
            <PageLayout>
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                    <div className="text-red-500">{error}</div>
                </Card>
            </PageLayout>
        );
    }

    if(loading || !profileData){
        return <Loading />;
    }

    return (
        <PageLayout>
            {/* Header */}
            <Header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm py-4">
                <Logo />
                <div className="flex items-center gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleDashboardClick}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span>Dashboard</span>
                    
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/login')}>
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                    </Button>
                </div>
            </Header>

            <Section className="py-8">
                {   /* Profile Card */}
                <Card className="bg-zinc-800 border-zinc-700 p-6 shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={profileData.profile_photo || "/placeholder.svg?height=150&width=150"} 
                                    alt={`${profileData.username}'s profile`} 
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-600 shadow-xl" 
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-semibold text-white mb-1">@{profileData.username}</h2>
                                <p className="text-zinc-400 mb-3">{profileData.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-evenly gap-4">
                            <div className="text-center bg-zinc-700/50 px-6 py-4 rounded-lg border border-zinc-600">
                                <h2 className="text-lg font-medium text-white mb-1">Friends</h2>
                                <p className="text-2xl text-white font-bold">{friends.length}</p>
                            </div>
                            <div className="text-center bg-zinc-700/50 px-6 py-4 rounded-lg border border-zinc-600">
                                <h2 className="text-lg font-medium text-white mb-1">Pending</h2>
                                <p className="text-2xl text-white font-bold">{requests.length}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs for Friends, Requests, Search */}
                <Tabs defaultValue="friends" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-8 bg-zinc-800 border-zinc-700">
                        <TabsTrigger value="friends" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Friends</span>
                        </TabsTrigger>
                        <TabsTrigger value="requests" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <UserPlus className="h-4 w-4 mr-2" />
                            <span>Requests</span>
                        </TabsTrigger>
                        <TabsTrigger value="search" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Search className="h-4 w-4 mr-2" />
                            <span>Search</span>
                        </TabsTrigger>
                        </TabsList>

                    {/* Friends Tab Content */}
                    <TabsContent value="friends" className="space-y-4">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Your Friends</CardTitle>
                                <CardDescription className="text-gray-400">
                                    You have {friends.length} friends
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add style tag for custom scrollbar */}
                                <style>{scrollbarStyles}</style>
                                
                                <div className="space-y-4 limit-height custom-scrollbar pr-2">
                                    {friends.length === 0 ? (
                                        <p className="text-center text-zinc-400 py-4">You don&apos;t have any friends yet. Add some friends to get started!</p>
                                    ) : (
                                        friends.map(friend => (
                                            <FriendCard 
                                                key={friend.friend_id}
                                                name={friend.friend_name}
                                                // email={friend.email}
                                                imgSrc={friend.profile_photo}
                                                onRemove={() => handleRemoveFriend(friend.friend_id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Requests Tab Content */}
                    <TabsContent value="requests" className="space-y-4">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Friend Requests</CardTitle>
                                <CardDescription className="text-gray-400">
                                    You have {requests.length} pending friend requests
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                                    {requests.length === 0 ? (
                                        <p className="text-center text-zinc-400 py-4">You don&apos;t have any pending friend requests.</p>
                                    ) : (
                                        requests.map(request => (
                                            <RequestCard 
                                                key={request.friend_id}
                                                name={request.friend_name}
                                                email={request.email}
                                                imgSrc={request.profile_photo}
                                                onAccept={() => handleAcceptRequest(request.friend_id)}
                                                onDecline={() => handleDeclineRequest(request.friend_id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Search Tab Content */}
                     <TabsContent value="search" className="space-y-4">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Find Friends</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Search for friends by name, username or email.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SearchBar
                                  value={searchTerm}
                                  onChange={handleSearchTermChange}
                                  onSubmit={handleSearch}
                                  placeholder="Search for friends..."
                                  className="mb-6"
                                />
                                
                                <div className="space-y-4">
                                    {/* Only show results or messages if hasSearched is true */}
                                    {hasSearched && (
                                        searchResults.length > 0 ? (
                                        searchResults.map(result => (
                                                !result.is_friend ? (
                                                    <SearchCard 
                                                        key={result.id}
                                                        name={result.full_name}
                                                        username={result.username}
                                                        imgSrc={result.profile_photo}
                                                        onRequest={() => handleRequest(result.username)}
                                                        isRequested={requestedUsers.includes(result.username)}
                                                    />
                                                ) : null
                                            ))
                                        ) : (
                                            <p className="text-center text-zinc-400 py-4">
                                                No results found for &quot;{searchTerm}&quot;
                                            </p>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Section>
        </PageLayout>
    );
};

const Friends = () => {
    return (
        // <AuthenticateUser>
            <Content />
        // </AuthenticateUser>
    );
};

export default Friends;