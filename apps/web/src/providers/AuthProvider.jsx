import { Auth0Provider } from '@auth0/auth0-react'

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } = process.env

export const AuthProvider = ({ children }) => (
  <Auth0Provider
    domain={REACT_APP_AUTH0_DOMAIN}
    clientId={REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    {children}
  </Auth0Provider>
)
