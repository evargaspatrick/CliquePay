import './App.css'
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/errorHandling/ErrorBoundary.jsx';
import router from "./route/routes.jsx";
import { SecurityUtils } from './utils/Security';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize CSRF token when app loads
    SecurityUtils.csrf.initCSRF();
  }, []);

  return (
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
  );
}

export default App
