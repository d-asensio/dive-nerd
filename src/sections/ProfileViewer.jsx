import Card from '@mui/joy/Card'
import { DiveProfileChart } from '../components'

export const ProfileViewer = ({ gridArea, samples, onDatapointHover }) => {
  return (
    <Card sx={{ gridArea }}>
      <DiveProfileChart
        samples={samples}
        onDatapointHover={onDatapointHover}
      />
    </Card>
  )
}
