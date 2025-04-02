import PropTypes from 'prop-types';
import { Button } from "../button";
import { Card, CardContent } from '../card';
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default function RequestCard({ name, imgSrc, email, onAccept, onDecline }) {
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
          <div className="flex flex-col gap-2">
            <Button size="sm" onClick={onAccept} className="bg-purple-600 hover:bg-purple-700">
              Accept
            </Button>
            <Button variant="outline" size="sm" onClick={onDecline} className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

RequestCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  email: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired
};