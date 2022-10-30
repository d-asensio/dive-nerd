import { Auth0Provider } from '@auth0/auth0-react'

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env

export const AuthProvider = ({ children }) => (
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    {children}
  </Auth0Provider>
)
