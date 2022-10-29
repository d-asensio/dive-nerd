import { DiveProfileChart } from '../components'
import {diveSelector} from '../selectors/dives';
import {useSelector} from '../store';
import {useDive} from '../hooks/useDive';

export const ProfileViewer = ({ diveId, onDatapointHover }) => {
  const dive = useSelector((state) => diveSelector(state, diveId))
  const { samples } = useDive(dive)

  return (
    <DiveProfileChart
      samples={samples}
      onDatapointHover={onDatapointHover}
    />
  )
}
