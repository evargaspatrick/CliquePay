import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              All
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Groups
            </TabsTrigger>
            <TabsTrigger value="direct" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Direct
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {/* Group Chats Section */}
            <GroupChatsList 
            />
          {/* Direct Messages Section */}
            <DirectMessagesList 
              directChats={directChats} 
              onOpenChat={onOpenDirectChat}
            />
          </TabsContent>
          
          <TabsContent value="groups">
            <GroupChatsList 
            />
          </TabsContent>
          
          <TabsContent value="direct">
            <DirectMessagesList 
              directChats={directChats} 
              onOpenChat={onOpenDirectChat}
            />
          </TabsContent>
        </Tabs>
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