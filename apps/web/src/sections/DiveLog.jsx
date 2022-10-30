import { Fragment, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { DiveList } from '../components'
import { useSelector } from '../store'
import { diveIdListSelector, diveSelector } from '../entities'

import { formatTimeMinutes } from '../utils/formatTime'
import { formatNumber } from '../utils/formatNumber'

function DiveItem({ diveId }) {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => navigate(`/dive/${diveId}`), [diveId])

  const { name, date, rating, profile } = useSelector((state) =>
    diveSelector(state, diveId),
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
        precision: 2,
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
          <DiveItem diveId={diveId} />
          {index !== diveIdList.length - 1 && <DiveList.Divider />}
        </Fragment>
      ))}
    </DiveList>
  )
}
