import PropTypes from 'prop-types';
import { UserPlus } from 'lucide-react';
import { Button } from "../button";
import { Card, CardContent } from '../card';
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default function SearchCard({ name, imgSrc, username, onRequest, isRequested }) {
  const displayName = name || 'Unknown User';
  
  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imgSrc} alt={displayName} />
            <AvatarFallback className="bg-purple-900/50 text-white">
              {displayName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-white">{displayName}</h3>
            <p className="text-sm text-zinc-400">{username || 'No username'}</p>
          </div>
          <Button 
            onClick={onRequest} 
            disabled={isRequested}
            className={`${isRequested 
              ? 'bg-zinc-700 text-zinc-300 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isRequested ? 'Requested' : 'Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

SearchCard.propTypes = {
  name: PropTypes.string,
  imgSrc: PropTypes.string,
  username: PropTypes.string,
  onRequest: PropTypes.func.isRequired,
  isRequested: PropTypes.bool
};