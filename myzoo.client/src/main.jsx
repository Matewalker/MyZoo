import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from "./UserContext.jsx"
import { AnimalProvider } from "./AnimalContext.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <UserProvider>
            <AnimalProvider>
                <App />
            </AnimalProvider>
    </UserProvider>
  </StrictMode>
)
