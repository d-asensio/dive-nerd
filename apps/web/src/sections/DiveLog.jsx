import { DiveList } from '../components'

import { diveIdListSelector, diveSelector } from '../selectors/dives'
import { useSelector } from '../store'
import {formatTimeMinutes} from '../utils/formatTime';
import {formatNumber} from '../utils/formatNumber';
import { useNavigate } from "react-router-dom";
import { Fragment, useCallback } from 'react';

function DiveItem({ id }) {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    () => navigate(`/dive/${id}`),
    [id]
  )

  const { name, date, rating, profile } = useSelector(
    state => diveSelector(state, id)
  )

  return (
    <DiveList.Item
      name={name}
      date={date}
      rating={rating}
      samples={profile.dataPoints}
      maximumDepth={formatNumber({
        value: profile.maximumDepth,
        units: 'm',
        precision: 2
      })}
      totalDuration={formatTimeMinutes(profile.totalDuration)}
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
        <Fragment key={diveId}>
          <DiveItem id={diveId} />
          {index !== diveIdList.length - 1 && <DiveList.Divider />}
        </Fragment>
      ))}
    </DiveList>
  )
}
