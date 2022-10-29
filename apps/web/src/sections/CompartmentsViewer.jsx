import { CompartmentsGasChart } from '../components'

export const CompartmentsViewer = ({ dataPoint, maxAmbientPressure }) => {
  return (
    <CompartmentsGasChart
      data={dataPoint}
      maxAmbientPressure={maxAmbientPressure}
    />
  )
}
