import createGraphqlEffect from './effect-graphql'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const { REACT_APP_DIVENERD_GRAPHQL_API_URL } = process.env

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  uri: REACT_APP_DIVENERD_GRAPHQL_API_URL,
  name: 'react-web-client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

export default createGraphqlEffect({ client })
