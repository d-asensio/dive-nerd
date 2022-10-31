import { DiveProfileChart } from '../components'
import { diveSelector } from '../entities/dives/selectors'
import { useSelector } from '../store'
import CircularProgress from "@mui/joy/CircularProgress";

export const ProfileViewer = ({ diveId, onDatapointHover }) => {
  const dive = useSelector((state) => diveSelector(state, diveId))

  if (!dive) return <CircularProgress />

  const { profile } = dive

  return (
    <DiveProfileChart
      samples={profile.dataPoints}
      onDatapointHover={onDatapointHover}
    />
  )
}
