import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle, UserPlus, MessageSquareDot } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { SecurityUtils } from "../../utils/security";
import { cn } from "../../lib/utils";
const Loading = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
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


// Separate Component for Chat Item
const GroupChatItem = ({ chat }) => {
  return (
    <Button 
      variant="ghost" 
      className="w-full p-0 h-auto bg-zinc-800 hover:bg-zinc-700 rounded-lg overflow-hidden"
      // onClick={() => onOpenChat(chat.id)}
    >
      <div className="w-full py-3 px-4 flex items-center">
        {/* LEFT: Avatar and participant count */}
        <div className="relative flex-shrink-0 mr-3">
          {/* Adjusts size of avatar within the tab */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatarSrc} alt={chat.name} />
            <AvatarFallback className="bg-purple-600 text-sm">{chat.name.charAt(0)}</AvatarFallback>
            {/* Adjusts the avatar badge in group chat list */}
          </Avatar>
          <div className="absolute -bottom-0.5 -right-1.5 bg-zinc-700 text-gray-300 text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center border border-zinc-600 text-[10px]">
            {chat.participants}
          </div>
        </div>
        
        {/* MIDDLE: Chat name and message preview */}
        <div className="flex-1 min-w-0 self-center">
          <div className="flex items-center">
            <p className="font-medium truncate">{chat.name}</p>
            {chat.unreadCount > 0 && (
              <MessageSquareDot className="h-4 w-4 ml-2 text-purple-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
        </div>
        
        {/* RIGHT: Time and unread count */}
        <div className="flex-shrink-0 ml-2 flex flex-col items-end justify-center">
          <span className="text-xs text-gray-400 mb-1">{chat.lastMessageTime}</span>
          {chat.unreadCount > 0 && (
            <span className="bg-purple-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
              {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Button>
  );
};

// Create New Group Modal
const NewGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      if (!groupName.trim()) {
        setError("Group name is required");
        return;
      }
      const token = await SecurityUtils.getCookie("idToken")
      if(!token){
        setError("You must be logged in to create a group")
        return;
      }
      
      const response = await fetch(`${API_URL}/create-group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: token, group_name: groupName, ...(description.trim() !== "" && { group_description: description }) }),
      });

      const data = await response.json();
      if(data.status === "SUCCESS"){
        // ADD TO GROUP CHATS
        onClose();
      } else {
        setError(data.message || "Failed to create group. Please try again.");
      }
    } catch (error) {
      setError("Failed to create group. Please try again.");
      return;
    } 
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Create New Group</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-white mb-1">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Group
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default function GroupChatsList() {
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [finalGroups, setFinalGroups] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = await SecurityUtils.getCookie("idToken")
        if (!token) return;
        
        const response = await fetch(`${API_URL}/get-user-groups/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token: token }),
        });
        
        const data = await response.json();
        if (data.status === "SUCCESS") {
          setUserGroups(data.groups);
          // Move this inside the fetchGroups function to ensure it runs after data is received
          setFinalGroups(sortGroups(data.groups)); 
        } else {
          console.error("Failed to fetch user groups:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };
    
    const sortGroups = (groups) => {
      if (!groups || !Array.isArray(groups)) return [];
      
      return groups.map((group) => ({
        id: group.group_id,
        name: group.group_name,
        avatarSrc: group.photo_url || "/placeholder.svg?height=40&width=40",
        lastMessage: group.last_message || "No messages yet",
        lastMessageTime: group.last_message_time || "",
        unreadCount: group.unread_count || 0,
        participants: group.members_count || 0
      }));
    };
    
    fetchGroups();
    setLoading(false);
  }, []); // No dependency on userGroups to avoid re-renders
  // Mock data for visual display purposes
  /* data format
    'group_id'
    'group_name'
    'created_at'
    'photo_url'
    'description'
    'role'
    'last_message'
    'last_message_time'
    'unread_count'
    'members_count'
  */

  // Add this line to handle modal opening/closing
  const handleToggleModal = () => setShowNewGroupModal(!showNewGroupModal);
  
  return (
    
    <div>
      {isLoading ? (<Loading />) : (
        <>
          {showNewGroupModal && <NewGroupModal onClose={() => setShowNewGroupModal(false)}/>}
          <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Group Chats</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
          onClick={handleToggleModal}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
        {finalGroups.length > 0 ? (
          <ul className="space-y-2">
            {finalGroups.map((chat) => (
              <li key={chat.id}>
                <GroupChatItem chat={chat} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-zinc-800 rounded-lg">
            <div className="flex justify-center mb-3">
              <UserPlus className="h-10 w-10 text-purple-400" />
            </div>
            <p className="text-gray-400 mb-3">No group chats yet</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewGroupModal(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create a Group
            </Button>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

