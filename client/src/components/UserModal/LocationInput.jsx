import React, { useState } from "react";

function LocationInput({
  getLocationMarkers,
  index,
  name,
  inputLocations,
  fetchRequest,
}) {
  const [locationStatus, setLocationStatus] = useState(() => {
    return inputLocations[index] ? 1 : -1;
  });

  class MakeMarker {
    constructor(lat, lng, title, description, date, name) {
      (this.lat = lat),
        (this.lng = lng),
        (this.title = title),
        (this.description = description),
        (this.date = date),
        (this.name = name);
    }
  }

  const inputHandler = async (event) => {
    try {
      const query = event.target.value;
      const accessToken =
        "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";
      const baseEndpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places";
      const searchUrl = `${baseEndpoint}/${encodeURIComponent(
        query
      )}.json?access_token=${accessToken}&limit=1`;

      const searchData = await fetchRequest("GET", searchUrl);
      if (searchData.features[0]) {
        const currentDate = new Date();
        const formattedDate = `${
          currentDate.getMonth() + 1
        }/${currentDate.getDate()}`;

        const newMarker = new MakeMarker(
          searchData.features[0].center[1],
          searchData.features[0].center[0],
          searchData.features[0].text,
          searchData.features[0].place_name,
          formattedDate,
          name
        );
        getLocationMarkers(newMarker, index);
        setLocationStatus(1);
      } else {
        getLocationMarkers("", index);
        setLocationStatus(0);
      }
    } catch (err) {
      console.error(err);
    }
  };
  let timeoutId = null;
  return (
    <div className="flex items-center space-x-2">
  <input
    type="text"
    className={`input input-bordered w-full text-white
        ${locationStatus === -1 && "input-primary"}
        ${locationStatus === 0 && "input-error"}
        ${locationStatus === 1 && "input-accent"}
      `}
    placeholder="Enter a location"
    defaultValue={inputLocations[index] ? inputLocations[index].title : ""}
    onChange={(event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => inputHandler(event), 500);
    }}
  />
  
  {locationStatus === -1 && (
    <span className="badge bg-base-300 text-gray-600 p-3">
      -
    </span>
  )}
  {locationStatus === 0 && (
    <span className="badge bg-base-300 text-red-500 p-3">
      X
    </span>
  )}
  {locationStatus === 1 && (
    <span className="badge bg-base-300 text-green-500 p-3">
      ✓
    </span>
  )}
</div>
  );
}

export default LocationInput;
