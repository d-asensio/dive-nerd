import Card from '@mui/joy/Card'
import { CompartmentsGasChart } from '../components'

export const CompartmentsViewer = ({ dataPoint, maxAmbientPressure }) => {
  return (
    <Card>
      <CompartmentsGasChart
        data={dataPoint}
        maxAmbientPressure={maxAmbientPressure}
      />
    </Card>
  )
}
