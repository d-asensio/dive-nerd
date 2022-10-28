import Card from '@mui/joy/Card'
import { DiveProfileChart } from '../components'

export const ProfileViewer = ({ samples, onDatapointHover }) => {
  return (
    <Card>
      <DiveProfileChart
        samples={samples}
        onDatapointHover={onDatapointHover}
      />
    </Card>
  )
}
