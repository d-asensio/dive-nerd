import { DiveProfileChart } from '../components'

export const ProfileViewer = ({ samples, onDatapointHover }) => {
  return (
    <DiveProfileChart
      samples={samples}
      onDatapointHover={onDatapointHover}
    />
  )
}
