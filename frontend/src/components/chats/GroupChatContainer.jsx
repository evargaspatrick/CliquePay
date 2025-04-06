import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  ArrowLeft, 
  UserPlus, 
  Info,
  Check,
  CheckCheck,
  MessageSquare
} from "lucide-react";
import { cn } from "../../lib/utils";
import { SecurityUtils } from "../../utils/security";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { X, Camera, Edit2, LogOut, Crown,Search } from "lucide-react";
import {  } from "lucide-react";
const InviteMembersList = ({ groupId, onInviteSuccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await SecurityUtils.getCookie("idToken");
      const response = await fetch(`${API_URL}/search-invite/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_token: token, 
          group_id: groupId,
          search_term: searchQuery
        }),
      });
      
      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        // The backend now handles filtering out existing members
        setSearchResults(data.users || []);
      } else {
        setError(data.message || "Failed to search users");
      }
    } catch (err) {
      setError("An error occurred while searching");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search when query changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Add user to selected users
  const addUser = (user) => {
    if (!selectedUsers.some(u => u.user_id === user.user_id)) {
      setSelectedUsers([...selectedUsers, user]);
      // Remove from search results
      setSearchResults(results => results.filter(r => r.user_id !== user.user_id));
    }
  };

  // Remove user from selected users
  const removeUser = (userId) => {
    setSelectedUsers(users => users.filter(user => user.user_id !== userId));
  };

  // Invite selected users to group
  const inviteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setIsLoading(true);
      const token = await SecurityUtils.getCookie("idToken");
      
      // Process invitations sequentially to handle potential race conditions
      let successCount = 0;
      let newInvitedUsers = [];
      
      for (const user of selectedUsers) {
        const response = await fetch(`${API_URL}/group-invite/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: token,
            group_id: groupId,
            invited_id: user.user_id
          }),
        });
        
        const data = await response.json();
        if (data.status === "SUCCESS") {
          successCount++;
          
          // Add invited user to the array with invite information
          newInvitedUsers.push({
            invite_id: data.invite_id, // Assuming backend returns invite_id
            user_id: user.user_id,
            full_name: user.full_name,
            profile_photo: user.profile_photo,
            username: user.username,
            invited_at: new Date().toISOString()
          });
        }
      }
      
      if (successCount > 0) {
        setSelectedUsers([]);
        setSearchQuery("");
        setSearchResults([]);
        
        // Pass the newly invited users to parent component
        if (onInviteSuccess) onInviteSuccess(newInvitedUsers);
      } else {
        setError("Failed to invite users. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while inviting users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <div className="absolute right-2 top-2 text-zinc-400">
          <Search className="h-4 w-4" />
        </div>
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-zinc-400 mb-2">Selected users:</p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(user => (
              <div 
                key={user.user_id}
                className="flex items-center bg-zinc-800 rounded-full pl-1 pr-2 py-1"
              >
                <div className="h-5 w-5 mr-1 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                  {user.avatar_url ? (
                    <img src={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-white">
                      {user.full_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-white">{user.full_name}</span>
                <button 
                  className="h-4 w-4 ml-1 p-0 flex items-center justify-center text-zinc-400 hover:text-white"
                  onClick={() => removeUser(user.user_id)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="mt-2 max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-md">
          <ul>
            {searchResults.map(user => (
              <li 
                key={user.user_id}
                className="p-2 hover:bg-zinc-800 cursor-pointer flex items-center justify-between"
                onClick={() => addUser(user)}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 mr-2 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                    {user.profile_photo ? (
                      <img src={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white">
                        {user.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.full_name}</p>
                    <p className="text-xs text-zinc-400">{user.username}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-zinc-400" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-2">
          <div className="animate-spin h-5 w-5 border-2 border-zinc-500 border-t-purple-500 rounded-full mx-auto"></div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* No Results Message */}
      {searchQuery && !isLoading && searchResults.length === 0 && (
        <p className="text-zinc-500 text-sm text-center py-2">No users found</p>
      )}

      {/* Invite Button */}
      {selectedUsers.length > 0 && (
        <div className="flex justify-end mt-4">
          <button 
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              isLoading 
                ? 'bg-zinc-700 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            onClick={inviteUsers}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite {selectedUsers.length} {selectedUsers.length === 1 ? 'User' : 'Users'}
          </button>
        </div>
      )}
    </div>
  );
};

// Add PropTypes
InviteMembersList.propTypes = {
  groupId: PropTypes.string.isRequired,
  onInviteSuccess: PropTypes.func
};

// Loading spinner component
const LoadingSpinner = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <div 
        className={cn(
          "animate-spin rounded-full border-4 border-zinc-700 border-t-purple-600", 
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

// Message bubble component
const MessageBubble = ({ message, isOwn }) => {
  // Format the date
  const formattedTime = message.created_at ? 
    format(new Date(message.created_at), 'h:mm a') : '';

  return (
    <div className={cn(
      "flex mb-2",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-lg px-3 py-2 break-words",
        isOwn ? 
          "bg-purple-600 text-white rounded-br-none" : 
          "bg-zinc-700 text-white rounded-bl-none"
      )}>
        {!isOwn && (
          <p className="text-xs text-purple-300 font-medium mb-1">{message.sender_name}</p>
        )}

        <p className="text-sm">{message.content}</p>
        
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs opacity-70">{formattedTime}</span>
          {isOwn && (
            <span className="ml-1">
              {message.is_read ? 
                <CheckCheck className="h-3 w-3 text-blue-300" /> : 
                <Check className="h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    message_id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    sender_id: PropTypes.string.isRequired,
    sender_name: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    is_read: PropTypes.bool
  }).isRequired,
  isOwn: PropTypes.bool.isRequired
};

// Error Display Component
const ErrorDisplay = ({ message }) => (
  <div className="bg-red-900/30 border border-red-500 rounded-md p-3 my-4 text-center">
    <p className="text-red-300">{message}</p>
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-2 border-red-500 text-red-300 hover:bg-red-900/50"
    >
      Try Again
    </Button>
  </div>
);

ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired
};

// Main GroupChatContainer component
const GroupChatContainer = ({ groupId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const userId = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages
  const fetchMessages = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = await SecurityUtils.getCookie("idToken");
      
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/get-group-messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id_token: token, 
          group_id: groupId,
          page: page,
          page_size: 50
        }),
      });

      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        // If we're loading more messages (pagination), append them
        if (page > 1) {
          setMessages(prevMessages => [...data.messages.reverse(), ...prevMessages]);
        } else {
          // First page or refresh - just set the messages
          setMessages(data.messages.reverse()); // Reverse to show oldest first
        }
        
        setPagination({
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.total_pages,
          hasMore: data.pagination.has_next
        });

        // Get user ID from first message if available
        if (data.messages && data.messages.length > 0) {
          // Store current user's ID to determine message ownership
          const idResponse = await fetch(`${API_URL}/user-profile/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: token }),
          });
          
          const userData = await idResponse.json();
          if (userData.status === "SUCCESS") {
            userId.current = userData.user_data.id;
          }
        }
        
        // Get group info
        fetchGroupInfo(token);
      } else {
        setError(data.message || "Failed to load messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("An error occurred while loading messages");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupInfo = async (token) => {
    try {
      const response = await fetch(`${API_URL}/group-info/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id_token: token, 
          group_id: groupId
        }),
      });

      const data = await response.json();
      if (data.status === "SUCCESS") {
        setGroupInfo(data.group_info);
        setGroupMembers(data.group_members || []);
        setInvitedUsers(data.invited_users || []);
        
        // Check if current user is admin
        if (data.group_members && userId.current) {
          const currentUser = data.group_members.find(member => member.user_id === userId.current);
          setIsAdmin(currentUser?.role === 'admin');
        }
      }
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const token = await SecurityUtils.getCookie("idToken");
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await fetch(`${API_URL}/send-group-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: token,
          group_id: groupId,
          content: newMessage,
          message_type: "TEXT"
        }),
      });
      
      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        // Add new message temporarily with optimistic UI update
        const tempMessage = {
          message_id: data.message_id || `temp-${Date.now()}`,
          content: newMessage,
          sender_id: userId.current,
          sender_name: "You", // Will be replaced on next fetch
          created_at: new Date().toISOString(),
          is_read: false
        };
        
        setMessages(prevMessages => [...prevMessages, tempMessage]);
        setNewMessage(""); // Clear input
        scrollToBottom();
        
        // Refresh messages after a short delay to get the real message
        setTimeout(() => {
          fetchMessages(1);
        }, 500);
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  // Load more messages when scrolling to top
  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchMessages(pagination.currentPage + 1);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchMessages(1);
    }
  }, [groupId]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleUpdateGroup = (updatedInfo) => {
    // Handle regular info updates
    if (updatedInfo.group_name || updatedInfo.description || updatedInfo.photo_url) {
      setGroupInfo(prevInfo => ({
        ...prevInfo,
        ...updatedInfo
      }));
    }
    
    // Handle new invites being added
    if (updatedInfo.newInvites && updatedInfo.newInvites.length > 0) {
      setInvitedUsers(prevInvites => [...prevInvites, ...updatedInfo.newInvites]);
    }
    
    // Handle invite cancellation
    if (updatedInfo.canceledInviteId) {
      setInvitedUsers(prevInvites => 
        prevInvites.filter(invite => invite.invite_id !== updatedInfo.canceledInviteId)
      );
    }
    
    // If the update is just to refresh data, fetch the group info
    if (Object.keys(updatedInfo).length === 0) {
      fetchGroupInfo();
    }
  };

  const toggleGroupInfo = () => {
    setShowGroupInfo(prevState => !prevState);
  };

  const handleInviteComplete = (newlyInvitedUsers) => {
    setShowInviteMembers(false);
    // Add new invites to the invitedUsers array
    if (newlyInvitedUsers && newlyInvitedUsers.length > 0) {
      setInvitedUsers(prevInvites => [...prevInvites, ...newlyInvitedUsers]);
    }
  };

  const InviteMembersDropdown = () => {
    if (!showInviteMembers) return null;
    
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800 rounded-md shadow-lg border border-zinc-700 overflow-hidden z-50">
        <div className="p-3 border-b border-zinc-700 flex justify-between items-center">
          <h4 className="font-medium">Invite Members</h4>
          <button 
            className="text-zinc-400 hover:text-white" 
            onClick={() => setShowInviteMembers(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3">
          <InviteMembersList 
            groupId={groupId} 
            onInviteSuccess={handleInviteComplete} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[65vh] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      {!showGroupInfo ? (
        // Chat Interface
        <>
          {/* Header */}
          <div className="bg-zinc-800 border-b border-zinc-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={groupInfo?.photo_url || "/placeholder.svg?height=40&width=40"} 
                  alt={groupInfo?.group_name || "Group"} 
                />
                <AvatarFallback className="bg-purple-600">
                  {(groupInfo?.group_name || "G").charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3">
                <h3 className="font-semibold">{groupInfo?.group_name || "Loading..."}</h3>
                <p className="text-xs text-zinc-400">
                  {groupInfo ? `${groupInfo.group_size} members` : "Loading..."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                  onClick={() => setShowInviteMembers(prev => !prev)}
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
                <InviteMembersDropdown />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                onClick={toggleGroupInfo}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-900 bg-[url('/chat-bg-pattern.png')] bg-opacity-5 bg-fixed">
            {isLoading && messages.length === 0 ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} />
            ) : (
              <>
                {pagination.hasMore && pagination.currentPage < pagination.totalPages && (
                  <div className="text-center mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLoadMore} 
                      className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                      Load More Messages
                    </Button>
                  </div>
                )}
                
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
                    <div className="bg-zinc-800/50 rounded-full p-6 mb-4">
                      <MessageSquare className="h-10 w-10 text-purple-500" />
                    </div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-2">Be the first to send a message in this group!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.message_id}
                      message={message}
                      isOwn={message.sender_id === userId.current}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-zinc-800 border-t border-zinc-700 flex items-center space-x-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <Image className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus-visible:ring-purple-600"
            />
            
            <Button 
              type="submit" 
              disabled={!newMessage.trim()} 
              size="icon" 
              className={cn(
                "bg-purple-600 hover:bg-purple-700 text-white",
                !newMessage.trim() && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </>
      ) : (
        <GroupInfoView 
          groupId={groupId}
          groupInfo={groupInfo} 
          groupMembers={groupMembers}
          invitedUsers={invitedUsers}
          isAdmin={isAdmin}
          onBack={toggleGroupInfo}
          onUpdateGroup={handleUpdateGroup}
        />
      )}
    </div>
  );
};

GroupChatContainer.propTypes = {
  groupId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired
};

const GroupInfoView = ({ groupId, groupInfo, groupMembers, invitedUsers, isAdmin, onBack, onUpdateGroup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    if (groupInfo) {
      setEditedName(groupInfo.group_name || "");
      setEditedDescription(groupInfo.description || "");
    }
  }, [groupInfo]);

  const handleSaveChanges = async () => {
    try {
      const token = await SecurityUtils.getCookie("idToken");
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await fetch(`${API_URL}/update-group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: token,
          group_id: groupId,
          group_name: editedName,
          description: editedDescription,
          // Handle photo update if needed
          // photo_data: profilePhoto
        }),
      });
      
      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        onUpdateGroup({
          group_name: editedName,
          description: editedDescription,
          photo_url: profilePhoto || groupInfo?.photo_url
        });
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update group");
      }
    } catch (err) {
      console.error("Error updating group:", err);
      setError("An error occurred while updating the group");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInviteComplete = (newlyInvitedUsers) => {
    setShowInviteMembers(false);
    // Pass new invites to parent component
    if (onUpdateGroup && newlyInvitedUsers && newlyInvitedUsers.length > 0) {
      onUpdateGroup({ newInvites: newlyInvitedUsers });
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const token = await SecurityUtils.getCookie("idToken");
      if (!token) return;

      if (onUpdateGroup) {
        onUpdateGroup({}); // This will trigger a refresh from the parent
      }
    } catch (error) {
      console.error("Error refreshing group info:", error);
    }
  };

  const handleCancelInvite = async (inviteId) => {
    try {
      const token = await SecurityUtils.getCookie("idToken");
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await fetch(`${API_URL}/cancel-group-invite/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: token,
          invite_id: inviteId
        }),
      });
      
      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        // Update the invitedUsers state locally by filtering out the canceled invite
        // Use a callback to ensure proper state update that respects props
        if (onUpdateGroup) {
          onUpdateGroup({ 
            canceledInviteId: inviteId 
          });
        }
      } else {
        setError(data.message || "Failed to cancel invite");
      }
    } catch (error) {
      console.error("Error canceling invite:", error);
      setError("Failed to cancel invite. Please try again.");
    }
  };

  return (
    <>
      {/* Header with back button */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">Group Info</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-zinc-900">
        {/* Group Photo and Name */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-zinc-800">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={profilePhoto || groupInfo?.photo_url || "/placeholder.svg?height=80&width=80"} 
                alt={groupInfo?.group_name || "Group"} 
              />
              <AvatarFallback className="bg-purple-600 text-2xl">
                {(groupInfo?.group_name || "G").charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {isAdmin && isEditing && (
              <label className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 cursor-pointer hover:border hover:border-green-500 hover:scale-105 transition-transform duration-20">
                <Camera className="h-5 w-5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <div className="w-full space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Group Name</label>
                <Input 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Group Description</label>
                <textarea 
                  value={editedDescription} 
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  className="border-zinc-700"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveChanges}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{groupInfo?.group_name}</h3>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {groupInfo?.description ? (
                <p className="text-sm text-zinc-400 mt-2 max-w-xs">{groupInfo.description}</p>
              ) : isAdmin ? (
                <p className="text-sm text-zinc-500 mt-2 italic cursor-pointer" onClick={() => setIsEditing(true)}>
                  Add a description
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Group Stats */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <p className="text-sm text-zinc-400">
            {groupInfo?.group_size || 0} members • Created on {groupInfo?.created_at ? 
              new Date(groupInfo.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown date'}
          </p>
        </div>

        {/* Members List */}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Members</h3>
            {isAdmin && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => setShowInviteMembers(prev => !prev)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                {showInviteMembers && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800 rounded-md shadow-lg border border-zinc-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-zinc-700 flex justify-between items-center">
                      <h4 className="font-medium">Invite Members</h4>
                      <button 
                        className="text-zinc-400 hover:text-white" 
                        onClick={() => setShowInviteMembers(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <InviteMembersList 
                        groupId={groupId} 
                        onInviteSuccess={handleInviteComplete} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className="space-y-2">
            {groupMembers?.map(member => (
              <li key={member.user_id} className="flex items-center p-2 rounded-md hover:bg-zinc-800">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={member.avatar_url} alt={member.full_name} />
                  <AvatarFallback className="bg-zinc-700">
                    {member.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium">{member.full_name}</p>
                    {member.role === 'admin' && (
                      <Crown className="h-4 w-4 ml-2 text-yellow-500" />
                    )}
                  </div>
                  {member.joined_at && (
                    <p className="text-xs text-zinc-400">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Invited Users Section */}
        <div className="px-4 py-3 border-t border-zinc-800">
          <h3 className="font-medium mb-3">Pending Invites</h3>
          
          {invitedUsers?.length > 0 ? (
            <ul className="space-y-2">
              {invitedUsers.map(invite => (
                <li key={invite.invite_id} className="flex items-center p-2 rounded-md hover:bg-zinc-800">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={invite.profile_photo} alt={invite.full_name} />
                    <AvatarFallback className="bg-zinc-700">
                      {invite.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium">{invite.full_name}</p>
                      <span className="ml-2 bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                        Invited
                      </span>
                    </div>
                    {invite.invited_at && (
                      <p className="text-xs text-zinc-400">
                        Invited {new Date(invite.invited_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-zinc-700"
                      onClick={() => handleCancelInvite(invite.invite_id)}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 italic">No pending invites</p>
          )}
        </div>
      </div>

      {/* Exit Group Button */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-800">
        <Button 
          variant="outline" 
          className="w-full border-red-800 text-red-500 hover:bg-red-900/20"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Exit Group
        </Button>
      </div>
    </>
  );
};

// Add PropTypes for the new component
GroupInfoView.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupInfo: PropTypes.object,
  groupMembers: PropTypes.array,
  invitedUsers: PropTypes.array,
  isAdmin: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onUpdateGroup: PropTypes.func.isRequired
};

export default GroupChatContainer;