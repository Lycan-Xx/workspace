import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import PlatformRoute from './components/EvaultPlatform/PlatfromRoute';
import { store } from './components/EvaultPlatform/store/store';
import { initializeAuth } from './components/EvaultPlatform/store/authSlice';
import "./index.css";

// Auth initializer component
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from Supabase session
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};
function App() {
	return (
		<Provider store={store}>
			<AuthInitializer>
				<PlatformRoute />
			</AuthInitializer>
		</Provider>
	);
}

export default App
