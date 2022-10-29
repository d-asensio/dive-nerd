import { DiveProfileChart } from '../components'
import {diveSelector} from '../selectors/dives';
import {useSelector} from '../store';

export const ProfileViewer = ({ diveId, onDatapointHover }) => {
  const dive = useSelector(
    state => diveSelector(state, diveId)
  )

  if (!dive) return null

  const { profile } = dive

  return (
    <DiveProfileChart
      samples={profile.dataPoints}
      onDatapointHover={onDatapointHover}
    />
  )
}
