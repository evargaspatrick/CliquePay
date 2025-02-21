import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SecurityUtils } from './security';
import Loading from '../components/Loading';

function AuthenticateUser({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await SecurityUtils.auth.isAuthenticated();
      if (!authenticated) {
        navigate('/login');
      }
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <Loading/>;
  }

  return isAuthenticated ? children : null;
}

AuthenticateUser.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticateUser;
