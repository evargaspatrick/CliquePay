import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export const FriendCard = ({ name, owes, isOwed, amount }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="w-16 h-16 rounded-full mb-2 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <FontAwesomeIcon 
            icon={faCircleUser}
            className="text-yellow-400"
            size="3x"
          />
        </div>
      </div>
      
      <span className="font-semibold text-gray-700 text-center">{name}</span>
      
      {(owes > 0 || (isOwed && amount > 0)) && (
        <div className={`mt-2 font-medium ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
          <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
          {(isOwed ? amount : owes)?.toFixed(2)}
        </div>
      )}
      
      <span className="text-sm mt-1 text-gray-500">
        {isOwed ? 'Owes you' : owes > 0 ? 'You owe' : ''}
      </span>
    </div>
  );
};

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  owes: PropTypes.number,
  isOwed: PropTypes.bool,
  amount: PropTypes.number
};