import { useCallback, useState, useRef, useEffect } from 'react'

import Map, { Marker } from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import Badge from '@mui/joy/Badge'
import Tooltip from '@mui/joy/Tooltip'

import { useSelector } from '../store'
import { diveSelector, diveIdListSelector, highlightedDiveSelector } from '../entities'
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
          color="primary"
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
                borderColor: 'primary.500',
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
  const mapRef = useRef(null)

  const diveIdList = useSelector(diveIdListSelector)
  const highlightedDive = useSelector(highlightedDiveSelector)

  useEffect(() => {
    if (!highlightedDive) return

    const { latitude, longitude } = highlightedDive.geographicCoordinates

    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 4,
      duration: 2000
    })
  }, [highlightedDive])

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
