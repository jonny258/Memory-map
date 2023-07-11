import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/map.css";

function Map({ center, mapClickHandler, mapLoadHandler }) {
  const [mapStyles, setMapStyles] = useState(
    "mapbox://styles/jonnman/cljn80p85002l01rgdt63guar"
  );

  const mapRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";

    const map = new mapboxgl.Map({
      container: "map",
      style: mapStyles,
      center: center,
      zoom: 10,
    });

    mapRef.current = map; // assign map object to ref

    map.on("click", (event) => {
      mapClickHandler(event);
    });

    map.on("load", (event) => {
      mapLoadHandler(event);
    });

    return () => {
      map.remove();
      map.off("click");
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyles);
    }
  }, [mapStyles]);

  return (
    <>
        <div className="map-styles-selector">
          <h3>Map Styles</h3>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-light"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn7z6j3001301ocf8xh52il"
                )
              }
            >
              Light
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn80p85002l01rgdt63guar"
                )
              }
            >
              Dark
            </button>
            <button
              type="button"
              className="btn btn-success"
              id="right-button"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn81k8o002f01r9ecuh6zxf"
                )
              }
            >
              Satellite
            </button>
          </div>
        </div>
        <div id="map"></div>
    </>
  );
}

export default Map;
