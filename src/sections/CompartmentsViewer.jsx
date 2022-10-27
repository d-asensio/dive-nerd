import Card from '@mui/joy/Card'
import { CompartmentsGasChart } from '../components'

export const CompartmentsViewer = ({ gridArea, dataPoint, maxAmbientPressure }) => {
  return (
    <Card
      sx={{ gridArea }}
    >
      <CompartmentsGasChart
        data={dataPoint}
        maxAmbientPressure={maxAmbientPressure}
      />
    </Card>
  )
}
