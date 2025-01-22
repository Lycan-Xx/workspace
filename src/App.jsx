import React from 'react';
import { Provider } from 'react-redux';
import PlatformRoute from './components/EvaultPlatform/PlatfromRoute';
import { store } from './components/EvaultPlatform/store/store';
import "./index.css";

function App() {
  return (
    <Provider store={store}>
      <PlatformRoute />
    </Provider>
  );
}

export default App