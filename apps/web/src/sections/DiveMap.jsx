import { useCallback, useState, useRef, Fragment } from 'react'

import Map, { Marker } from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import Badge from '@mui/joy/Badge'
import Tooltip from '@mui/joy/Tooltip'

import { useSelector } from '../store'
import { diveSelector, diveIdListSelector } from '../entities'
import {useNavigate} from 'react-router-dom';

const DiveMapMarker = ({ diveId }) => {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => navigate(`/dive/${diveId}`), [diveId])

  const { name, geographicCoordinates: { latitude, longitude } } = useSelector((state) =>
    diveSelector(state, diveId),
  )

  return (
    <Marker longitude={longitude} latitude={latitude} anchor="center">
      <Tooltip
        title={name}
        placement="top"
        variant="outlined"
        arrow
      >
        <Badge
          badgeInset="50%"
          color="success"
          size="lg"
          sx={{
            p: 1.5,
            transition: 'transform 300ms',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.5)'
            },
            '& .JoyBadge-badge': {
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '2px solid',
                borderColor: 'success.500',
                content: '""',
              },
            },
            '@keyframes ripple': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(2)',
                opacity: 0,
              },
            },
          }}
          onClick={handleNavigate}
        />
      </Tooltip>
    </Marker>
  )
}

export const DiveMap = () => {
  const diveIdList = useSelector(diveIdListSelector)

  // const handleResetClick = useCallback(() => {
  //   mapRef.current?.flyTo({
  //     center: [-100, 40],
  //     zoom: 3.5,
  //     duration: 2000
  //   })
  // }, [])

  const mapRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  })

  const handleMapMove = useCallback(
    ({ viewState }) => setViewState(viewState),
    [],
  )

  return (
    <Map
      {...viewState}
      mapLib={mapboxgl}
      ref={mapRef}
      mapStyle="mapbox://styles/mapbox/light-v9"
      onMove={handleMapMove}
    >
      {diveIdList.map((diveId) => (
        <DiveMapMarker key={diveId} diveId={diveId} />
      ))}
    </Map>
  )
}
