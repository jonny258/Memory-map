import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapStyles from "./MapStyles";

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

    mapRef.current = map;

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
    <div className="w-4/5 h-[70vh] box-border">
      <MapStyles setMapStyles={setMapStyles} />
      <div id="map" className="w-full h-full"></div>
    </div>
  );
}

export default Map;
