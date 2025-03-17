import { cn } from "../../lib/utils";
import PropTypes from 'prop-types';

export function Container({ className, ...props }) {
  return <div className={cn("container mx-auto px-4 md:px-6", className)} {...props} />;
}

Container.propTypes = {
  className: PropTypes.string,
};

