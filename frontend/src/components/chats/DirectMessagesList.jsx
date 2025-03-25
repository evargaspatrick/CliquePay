import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PropTypes from "prop-types";

export default function DirectMessagesList({ directChats, onOpenChat }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Direct Messages</h3>
        <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
          New Message
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {directChats.length > 0 ? (
          <ul className="space-y-2">
            {directChats.map((chat) => (
              <li key={chat.id}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                  onClick={() => onOpenChat(chat.id)}
                >
                  <div className="flex items-center w-full">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={chat.avatarSrc} alt={chat.name} />
                      <AvatarFallback className="bg-purple-900/50">{chat.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{chat.name}</p>
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
            <p className="text-gray-400">No conversations yet</p>
            <Button className="mt-3 bg-purple-600 hover:bg-purple-700">Start a conversation</Button>
          </div>
        )}
      </div>
    </div>
  );
}

DirectMessagesList.propTypes = {
  directChats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatarSrc: PropTypes.string,
      lastMessage: PropTypes.string,
      lastMessageTime: PropTypes.string,
      unreadCount: PropTypes.number
    })
  ).isRequired,
  onOpenChat: PropTypes.func.isRequired
};