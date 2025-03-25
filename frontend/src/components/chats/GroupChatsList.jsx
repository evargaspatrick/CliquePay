import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle, UserPlus, MessageSquareDot } from "lucide-react";
import PropTypes from "prop-types";

export default function GroupChatsList({ groupChats, onOpenChat }) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Group Chats</h3>
        <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
        {displayGroups.length > 0 ? (
          <ul className="space-y-2">
            {displayGroups.map((chat) => (
              <li key={chat.id}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                  onClick={() => onOpenChat(chat.id)}
                >
                  <div className="flex items-center w-full">
                    <div className="relative">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={chat.avatarSrc} alt={chat.name} />
                        <AvatarFallback className="bg-purple-600">{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-zinc-700 text-gray-300 text-xs rounded-full h-5 px-2 flex items-center justify-center border border-zinc-600">
                        {chat.participants}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <p className="font-medium truncate">{chat.name}</p>
                          {chat.unreadCount > 0 && (
                            <MessageSquareDot className="h-4 w-4 ml-2 text-purple-400" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 bg-purple-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-zinc-800 rounded-lg">
            <div className="flex justify-center mb-3">
              <UserPlus className="h-10 w-10 text-purple-400" />
            </div>
            <p className="text-gray-400 mb-3">No group chats yet</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create a Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

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