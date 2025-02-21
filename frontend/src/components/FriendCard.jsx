import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // Changed from free-regular-svg-icons
import PropTypes from 'prop-types';

export const FriendCard = ({ name }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
      <FontAwesomeIcon 
        icon={faCircleUser}  // Using the imported solid icon
        className="text-green-600 mb-2"
        size="3x"
      />
      <span className="font-semibold text-gray-700">{name}</span>
    </div>
  );
};

FriendCard.propTypes = {
  name: PropTypes.string.isRequired
};