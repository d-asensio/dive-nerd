import { ApolloServer, gql } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

import { createFakeDivesRepository } from './repositories/fakeDivesRepository'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type GeographicCoordinates {
    latitude: Float!
    longitude: Float!
  }

  type CartesianCoordinates {
    x: Float!
    y: Float!
  }

  type GasMixture {
    O2: Float!
    N2: Float!
    He: Float!
  }

  type CompartmentsGasLoad {
    id: ID!
    highCeiling: Float!
    lowCeiling: Float!
    maxValue: Float!
    pressureLoadN2: Float!
  }

  type DiveProfileDataPoint {
    time: Float!
    depth: Float!
    temperature: Float
    gasMixture: GasMixture!

    x: Float!
    y: Float!

    ambientPressure: Float!
    ambientPressureDelta: Float!
    depthDelta: Float!
    descentRate: Float!
    timeDelta: Float!
    alveolarPressureN2: Float!

    compartmentsGasLoad: [CompartmentsGasLoad!]!

    lowCeiling: Float!
    highCeiling: Float!
    maxValue: Float!
  }

  type DiveProfile {
    maximumDepth: Float!
    totalDuration: Float!
    dataPoints: [DiveProfileDataPoint!]!
  }

  type Dive {
    id: ID!
    name: String!
    date: String!
    rating: Int
    geographicCoordinates: GeographicCoordinates
    profile: DiveProfile!
  }

  type Query {
    dives: [Dive!]!
  }
`

const divesRepository = createFakeDivesRepository()

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    dives: () => divesRepository.getAllDives()
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

exports.graphql = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  }
})
