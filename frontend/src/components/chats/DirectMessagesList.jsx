import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle, MessageCircle, MessageSquareDot } from "lucide-react";
import PropTypes from "prop-types";

// Separate Component for Direct Message Item
const DirectMessageItem = ({ chat, onOpenChat }) => {
  return (
    <Button 
      variant="ghost" 
      className="w-full p-0 h-auto bg-zinc-800 hover:bg-zinc-700 rounded-lg overflow-hidden"
      onClick={() => onOpenChat(chat.id)}
    >
      <div className="w-full py-3 px-4 flex items-center">
        {/* LEFT: Avatar with online indicator */}
        <div className="relative flex-shrink-0 mr-3">
          {/* Adjusts avataer size */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatarSrc} alt={chat.name} />
            <AvatarFallback className="bg-purple-900/50 text-sm">
              {chat.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
            {/* Adjusts status symbol */}
          </Avatar>
          {chat.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-800 rounded-full"></span>
          )}
        </div>
        
        {/* MIDDLE: Name and message */}
        <div className="flex-1 min-w-0 self-center">
          <div className="flex items-center">
            <p className="font-medium truncate">{chat.name}</p>
            {chat.unreadCount > 0 && (
              <MessageSquareDot className="h-4 w-4 ml-2 text-purple-400 flex-shrink-0" />
            )}
          </div>
          {chat.isTyping ? (
            <p className="text-sm text-purple-400 font-medium">typing...</p>
          ) : (
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          )}
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

export default function DirectMessagesList({ directChats, onOpenChat }) {
  // Mock data for visual display purposes
  const demoChats = [
    {
      id: 1,
      name: "Alice Johnson",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for paying!",
      lastMessageTime: "11:45 AM",
      unreadCount: 1,
      online: true,
      isTyping: false
    },
    {
      id: 2,
      name: "Bob Smith",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll send you my part tomorrow",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: true,
      isTyping: true
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "Did you see the bill?",
      lastMessageTime: "Monday",
      unreadCount: 0,
      online: false,
      isTyping: false
    },
    {
      id: 4,
      name: "Dana Davis",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "Let's split the rent 50/50",
      lastMessageTime: "Sunday",
      unreadCount: 0,
      online: false,
      isTyping: false
    },
    {
      id: 5,
      name: "Elijah Wilson",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "Movie tonight?",
      lastMessageTime: "Mar 22",
      unreadCount: 0,
      online: false,
      isTyping: false
    },
    {
      id: 6,
      name: "Fiona Green",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      lastMessage: "I paid for dinner",
      lastMessageTime: "Mar 20",
      unreadCount: 2,
      online: true,
      isTyping: false
    },
  ];

  // Use the actual props in a real implementation
  const displayChats = directChats.length > 0 ? directChats : demoChats;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Direct Messages</h3>
        <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
        {displayChats.length > 0 ? (
          <ul className="space-y-2">
            {displayChats.map((chat) => (
              <li key={chat.id}>
                <DirectMessageItem chat={chat} onOpenChat={onOpenChat} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-zinc-800 rounded-lg">
            <div className="flex justify-center mb-3">
              <MessageCircle className="h-10 w-10 text-purple-400" />
            </div>
            <p className="text-gray-400 mb-3">No conversations yet</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Start a conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

DirectMessageItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatarSrc: PropTypes.string,
    lastMessage: PropTypes.string,
    lastMessageTime: PropTypes.string,
    unreadCount: PropTypes.number,
    online: PropTypes.bool,
    isTyping: PropTypes.bool
  }).isRequired,
  onOpenChat: PropTypes.func.isRequired
};

DirectMessagesList.propTypes = {
  directChats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatarSrc: PropTypes.string,
      lastMessage: PropTypes.string,
      lastMessageTime: PropTypes.string,
      unreadCount: PropTypes.number,
      online: PropTypes.bool,
      isTyping: PropTypes.bool
    })
  ).isRequired,
  onOpenChat: PropTypes.func.isRequired
};