import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "../components/Map";

function Social() {

    const mapClickHandler = (event) => {
        console.log(event)
    }

    const mapLoadHandler = (event) => {
        console.log(event.target)
    }

    return (
        <div className="map-container">
        <Map center={[-111.88, 40.67]} mapClickHandler={mapClickHandler} mapLoadHandler={mapLoadHandler}/>

        </div>
      );
}

export default Social;

//Addin laoding
