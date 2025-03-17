import './App.css'
import { RouterProvider } from 'react-router-dom';
import router from "./route/routes.jsx";
import { SecurityUtils } from './utils/security';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize CSRF token when app loads
    SecurityUtils.csrf.initCSRF();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
