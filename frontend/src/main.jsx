import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'
import { ThemeProvider } from "../src/components/theme-provider.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  },
  {
    path: '/view-trip/:tripId',
    element: <ViewTrip />
  },
  {
    path: '/my-trips',
    element: <MyTrips />
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={ import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID }>
        <Toaster position="top-right" reverseOrder={false} />
        <Header />
        <RouterProvider router={ router } />
      </GoogleOAuthProvider>
  </ThemeProvider>
)
