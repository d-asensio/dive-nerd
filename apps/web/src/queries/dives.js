import { gql } from '@apollo/client'

export const getAllDivesQuery = gql`
  query {
    dives {
      id
      name
      date
      rating
      geographicCoordinates {
        latitude
        longitude
      }
      profile {
        maximumDepth
        totalDuration
        dataPoints {
          time
          depth
          temperature
          ambientPressure
          ambientPressureDelta
          timeDelta
          depthDelta
          descentRate
          alveolarPressureN2
          lowCeiling
          highCeiling
          maxValue
          compartmentsGasLoad {
            id
            highCeiling
            lowCeiling
            maxValue
            pressureLoadN2
          }
          gasMixture {
            O2
            N2
            He
          }
          x
          y
        }
      }
    }
  }
`
