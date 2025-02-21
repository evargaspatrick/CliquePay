import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <FontAwesomeIcon 
        icon={faCircleUser} 
        className="text-green-600 cursor-pointer hover:text-green-700 transition"
        size="4x"
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 z-10 divide-y divide-gray-200">
          <div 
            className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center text-gray-800 hover:text-green-600"
            onClick={() => navigate('/profile')}
          >
            Profile Settings
          </div>
          <div 
            className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center text-gray-800 hover:text-green-600"
            onClick={() => navigate('/account')}
          >
            Account Settings
          </div>
          <div 
            className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center text-gray-800 hover:text-red-600"
            onClick={() => navigate('/logout')}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};