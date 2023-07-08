import React, { useState, useRef } from "react";

function LocationInput({ getLocationMarkers, index, name, inputLocations }) {
  const [locationStatus, setLocationStatus] = useState(()=> {
    if(inputLocations[index]){
        return 1
    }else{
        return -1
    }
  });
  const locationInputRef = useRef("");
  let timeoutId = null;

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

  const inputHandler = () => {
    const query = locationInputRef.current.value;

    const accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";
    const baseEndpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places";
    const url = `${baseEndpoint}/${encodeURIComponent(
      query
    )}.json?access_token=${accessToken}&limit=1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.features[0]) {

            const currentDate = new Date();
            const formattedDate = `${
              currentDate.getMonth() + 1
            }/${currentDate.getDate()}`;

            const newMarker = new MakeMarker(
                data.features[0].center[1],
                data.features[0].center[0],
                data.features[0].text,
                data.features[0].place_name,
                formattedDate,
                name
            )

            // console.log(newMarker)
            getLocationMarkers(newMarker, index);
          setLocationStatus(1);
        } else {
          getLocationMarkers('', index);
          setLocationStatus(0);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="input-group mb-3">
      <input
        ref={locationInputRef}
        type="text"
        className="form-control"
        placeholder="Enter a location"
        defaultValue={inputLocations[index] ? inputLocations[index].title : ''}
        onChange={() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(inputHandler, 1000);
        }}
      />
      {locationStatus === -1 && (
        <span
          className="input-group-text"
          id="basic-addon2"
          style={{ color: "gray" }}
        >
          -
        </span>
      )}
      {locationStatus === 0 && (
        <span
          className="input-group-text"
          id="basic-addon2"
          style={{ color: "red" }}
        >
          X
        </span>
      )}
      {locationStatus === 1 && (
        <span
          className="input-group-text"
          id="basic-addon2"
          style={{ color: "green" }}
        >
          ✓
        </span>
      )}
    </div>
  );
}

export default LocationInput;
