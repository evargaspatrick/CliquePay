import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription } from "./card";

export function FeatureCard({ icon: Icon, title, description, className }) {
  return (
    <Card className={cn("bg-zinc-800 border-zinc-700", className)}>
      <CardHeader>
        <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Icon className="text-purple-400" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string
};

