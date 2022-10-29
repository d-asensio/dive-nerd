import Map from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useCallback, useState, useRef } from 'react'

export const DiveMap = () => {
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
    zoom: 3.5
  })

  const handleMapMove = useCallback(
    ({ viewState }) => setViewState(viewState),
    []
  )

  return (
    <Map
      {...viewState}
      style={{
        width: '100%',
        height: '100%'
      }}
      mapLib={mapboxgl}
      ref={mapRef}
      mapStyle='mapbox://styles/mapbox/streets-v9'
      onMove={handleMapMove}
    />
  )
}
