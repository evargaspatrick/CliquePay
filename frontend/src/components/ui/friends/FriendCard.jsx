import PropTypes from 'prop-types';
import { Button } from "../button";
import { Card, CardContent } from '../card';
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default function FriendCard({ name, imgSrc, email, onRemove }) {
  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imgSrc} alt={name} />
            <AvatarFallback className="bg-purple-900/50 text-white">
              {name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-white">{name}</h3>
            <p className="text-sm text-zinc-400">{email}</p>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
            Message
          </Button>
          <Button variant="outline" size="sm" onClick={onRemove} className="border-red-700 text-red-400 hover:bg-red-900/20">
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  email: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};