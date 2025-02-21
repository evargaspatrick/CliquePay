import { createContext, useContext, useEffect } from 'react';
import { SecurityUtils } from '../utils/security';
import PropTypes from 'prop-types';

const SecurityContext = createContext(null);

export function SecurityProvider({ children }) {
  useEffect(() => {
    SecurityUtils.csrf.initCSRF();
    
    // Refresh CSRF token periodically (optional)
    const refreshInterval = setInterval(() => {
      SecurityUtils.csrf.initCSRF();
    }, 3600000); // Refresh every hour

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <SecurityContext.Provider value={SecurityUtils}>
      {children}
    </SecurityContext.Provider>
  );
}

SecurityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSecurity = () => useContext(SecurityContext);