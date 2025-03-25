import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import GroupChatsList from "./GroupChatsList";
import DirectMessagesList from "./DirectMessagesList";
import PropTypes from "prop-types";

export default function ChatsContainer({ 
  groupChats, 
  directChats, 
  onOpenGroupChat, 
  onOpenDirectChat 
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Chats</CardTitle>
        <CardDescription className="text-gray-400">
          Stay connected with your friends and groups
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Group Chats Section */}
        <GroupChatsList 
          groupChats={groupChats} 
          onOpenChat={onOpenGroupChat}
        />
        
        {/* Direct Messages Section */}
        <DirectMessagesList 
          directChats={directChats} 
          onOpenChat={onOpenDirectChat}
        />
      </CardContent>
    </Card>
  );
}

ChatsContainer.propTypes = {
  groupChats: PropTypes.array.isRequired,
  directChats: PropTypes.array.isRequired,
  onOpenGroupChat: PropTypes.func.isRequired,
  onOpenDirectChat: PropTypes.func.isRequired
};