import React from 'react'

function MapStyles({ setMapStyles }) {
  return (
    <div className="absolute top-0 left-0 bg-white rounded-lg shadow z-20">
  <h3 className="font-bold text-xl mb-2">Map Styles</h3>
  <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
    <button
      type="button"
      className="btn btn-outline"
      onClick={() =>
        setMapStyles("mapbox://styles/jonnman/cljn7z6j3001301ocf8xh52il")
      }
    >
      Light
    </button>
    <button
      type="button"
      className="btn"
      onClick={() =>
        setMapStyles("mapbox://styles/jonnman/cljn80p85002l01rgdt63guar")
      }
    >
      Dark
    </button>
    <button
      type="button"
      className="btn btn-accent"
      onClick={() =>
        setMapStyles("mapbox://styles/jonnman/cljn81k8o002f01r9ecuh6zxf")
      }
    >
      Satellite
    </button>
  </div>
</div>
  )
}

export default MapStyles