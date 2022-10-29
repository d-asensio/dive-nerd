import { DiveProfileChart } from '../components'
import {diveSelector} from '../selectors/dives';
import {useSelector} from '../store';

export const ProfileViewer = ({ diveId, onDatapointHover }) => {
  const { profile } = useSelector(
    state => diveSelector(state, diveId)
  )

  return (
    <DiveProfileChart
      samples={profile.dataPoints}
      onDatapointHover={onDatapointHover}
    />
  )
}
