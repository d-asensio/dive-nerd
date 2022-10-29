import createGraphqlEffect from './effect-graphql'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  uri: 'http://localhost:9000/dev/graphql',
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
