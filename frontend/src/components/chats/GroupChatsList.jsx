import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle, UserPlus, MessageSquareDot } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { SecurityUtils } from "../../utils/security";
// Separate Component for Chat Item
const GroupChatItem = ({ chat, onOpenChat }) => {
  return (
    <Button 
      variant="ghost" 
      className="w-full p-0 h-auto bg-zinc-800 hover:bg-zinc-700 rounded-lg overflow-hidden"
      onClick={() => onOpenChat(chat.id)}
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
        body: JSON.stringify({ id_token: token, group_name: groupName, group_description: (description!=""? description : null) }),
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
export default function GroupChatsList({ groupChats, onOpenChat }) {
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  // Mock data for visual display purposes
  const demoGroups = [
    {
      id: 1,
      name: "Weekend Trip",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll bring the snacks!",
      lastMessageTime: "10:23 AM",
      unreadCount: 3,
      participants: 5
    },
    {
      id: 2,
      name: "Apartment Expenses",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "Rent is due next Monday",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      participants: 3
    },
    {
      id: 3,
      name: "Movie Night",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "What about Friday?",
      lastMessageTime: "Yesterday",
      unreadCount: 5,
      participants: 7
    },
    {
      id: 4,
      name: "Road Trip Planning",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "I found a great route!",
      lastMessageTime: "Mar 22",
      unreadCount: 0,
      participants: 4
    },
    {
      id: 5,
      name: "Birthday Party",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "It's a surprise!",
      lastMessageTime: "Mar 20",
      unreadCount: 0,
      participants: 9
    },
  ];

  // Use the actual props in a real implementation
  const displayGroups = groupChats.length > 0 ? groupChats : demoGroups;

  // Add this line to handle modal opening/closing
  const handleToggleModal = () => setShowNewGroupModal(!showNewGroupModal);

  return (
    <div>
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
        {displayGroups.length > 0 ? (
          <ul className="space-y-2">
            {displayGroups.map((chat) => (
              <li key={chat.id}>
                <GroupChatItem chat={chat} onOpenChat={onOpenChat} />
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
    </div>
  );
}

GroupChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatarSrc: PropTypes.string,
    lastMessage: PropTypes.string,
    lastMessageTime: PropTypes.string,
    unreadCount: PropTypes.number,
    participants: PropTypes.number
  }).isRequired,
  onOpenChat: PropTypes.func.isRequired
};

GroupChatsList.propTypes = {
  groupChats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatarSrc: PropTypes.string,
      lastMessage: PropTypes.string,
      lastMessageTime: PropTypes.string,
      unreadCount: PropTypes.number,
      participants: PropTypes.number
    })
  ).isRequired,
  onOpenChat: PropTypes.func.isRequired
};