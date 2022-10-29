import { DiveList } from '../components'

import { diveIdListSelector, diveSelector } from '../selectors/dives'
import { useSelector } from '../store'
import { useDive } from '../hooks/useDive'
import {formatTime} from '../utils/formatTime';
import {formatNumber} from '../utils/formatNumber';
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';


function DiveItem({ id }) {
  const navigate = useNavigate();
  const dive = useSelector((state) => diveSelector(state, id))
  const { samples } = useDive(dive)

  const handleNavigate = useCallback(
    () => navigate(`/dive/${id}`),
    [id]
  )

  const {
    name,
    date,
    maximumDepth,
    totalDuration,
    rating
  } = dive

  return (
    <DiveList.Item
      name={name}
      date={date}
      rating={rating}
      samples={samples}
      maximumDepth={formatNumber({
        value: maximumDepth,
        units: 'm',
        precision: 2
      })}
      totalDuration={formatTime(totalDuration)}
      onClick={handleNavigate}
    />
  )
}

export const DiveLog = () => {
  const diveIdList = useSelector(diveIdListSelector)

  if (!diveIdList) return null

  return (
    <DiveList>
      {diveIdList.map((diveId, index) => (
        <>
          <DiveItem key={diveId} id={diveId} />
          {index !== diveIdList.length - 1 && <DiveList.Divider />}
        </>
      ))}
    </DiveList>
  )
}
