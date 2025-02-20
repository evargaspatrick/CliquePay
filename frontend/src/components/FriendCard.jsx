import PropTypes from 'prop-types';

export const FriendCard = ({ name, imgSrc }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center">
      <img className="h-16 w-16 rounded-full mx-auto mb-2" src={imgSrc} alt={name} />
      <p className="font-semibold">{name}</p>
    </div>
  );
};

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired
};