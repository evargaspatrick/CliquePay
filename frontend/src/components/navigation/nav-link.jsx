import { Link } from "react-router-dom"
import { cn } from "../../lib/utils";
import PropTypes from 'prop-types';

export function NavLink({ to, className, ...props }) {
  return <Link to={to} className={cn("text-gray-300 hover:text-white transition-colors", className)} {...props} />
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
};