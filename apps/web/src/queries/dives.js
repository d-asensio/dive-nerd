import { gql } from '@apollo/client'

export const getAllDivesQuery = gql`
  query {
    dives {
      id
      name
      rating
      geographicCoordinates {
        latitude
        longitude
      }
      profile {
        maximunDepth
        totalDuration
        dataPoints {
          time
          depth
          temperature
          ambientPressure
          ambientPressureDelta
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
          cartesianCoordinates {
            x
            y
          }
          gasMixture {
            O2
            N2
            He
          }
        }
      }
    }
  }
`
