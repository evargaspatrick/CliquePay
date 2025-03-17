import { cn } from "../../lib/utils";
import PropTypes from 'prop-types';
Section.propTypes = {
  className: PropTypes.string,
};

export function Section({ className, ...props }) {
  return <section className={cn("py-12 md:py-24 lg:py-32", className)} {...props} />;
}

