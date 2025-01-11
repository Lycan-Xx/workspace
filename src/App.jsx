import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import PlatformApp from "./components/EvaultPlatform/PlatformApp"
import "./index.css"

function App() {
  return (
	<BrowserRouter>
		<PlatformApp />
	</BrowserRouter>
  )
}

export default App