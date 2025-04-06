import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  MoreVertical, 
  ArrowLeft, 
  UserPlus, 
  Phone,
  Info,
  Check,
  CheckCheck,
  MessageSquare
} from "lucide-react";
import { cn } from "../../lib/utils";
import { SecurityUtils } from "../../utils/security";
import { format } from "date-fns";
import PropTypes from "prop-types";

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
      onClick={() => fetchMessages(1)}
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
    totalPages: 1
  });
  
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

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
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
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700">
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700">
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
    </div>
  );
};

GroupChatContainer.propTypes = {
  groupId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired
};

export default GroupChatContainer;