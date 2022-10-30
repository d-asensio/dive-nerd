import { Auth0Provider } from '@auth0/auth0-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } = process.env

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const handleRedirect = useCallback((appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname)
  }, [])

  return (
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={handleRedirect}
    >
      {children}
    </Auth0Provider>
  )
}
