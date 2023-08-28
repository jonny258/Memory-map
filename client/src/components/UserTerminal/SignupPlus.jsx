import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { useNavigate } from "react-router-dom";
import LocationInput from "./LocationInput";
import PictureUploader from "../PictureUploader";

function SignupPlus({
  fetchRequest,
  email,
  password,
  setUserState,
  setShowSignup,
  setShowSignupPlus,
  name,
  setName,
}) {

  const navigate = useNavigate();
  
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";

  const MAX_LOCATIONS = 5;
  const [locationCount, setLocationCount] = useState(0);
  const [inputLocations, setInputLocations] = useState([]);
  const [pictureState, setPictureState] = useState("");
  const [color, setColor] = useState("#000000");

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      if (email && password && name) {
        const namedMarkers = inputLocations
          .filter((marker) => marker.name && marker.name.trim() !== "")
          .map((marker) => {
            marker.name = name;
            return marker;
          });
        console.log(pictureState);
        const body = {
          email: email,
          password: password,
          name: name,
          color: color,
          pfp: pictureState,
          markers: namedMarkers,
        };
        const signUpUrl = `${API_BASE_URL}/api/user/signup`;

        const userData = await fetchRequest("POST", signUpUrl, body);
        console.log(userData);
        setUserState(userData);
        navigate("/home");
      } else {
        alert("Please fill out all required fields");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLocationMarkers = (data, index) => {
    inputLocations[index] = data;
  };

  const addALocationHandler = (event) => {
    event.preventDefault();
    if (locationCount < MAX_LOCATIONS) {
      setLocationCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className="flex space-x-5">
      <div>
        <h2 className="mt-0 text-center text-xl font-semibold">About you</h2>

        <div className="bg-gray-600 rounded-md border-none m-4 p-3">
          <label className="label">
            <span className="label-text text-lg">Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered input-accent w-full text-white"
            defaultValue={name && name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="bg-gray-600 p-4 m-4 rounded-md">
          <PictureUploader
            uploadText={"Pick a profile picture"}
            pictureState={pictureState}
            setPictureState={setPictureState}
          />
        </div>
        <div className="flex items-center justify-center bg-gray-600 p-4 m-4 rounded-md">
          <ChromePicker
            color={color}
            onChange={(event) => setColor(event.hex)}
          />
        </div>
        <div className="flex space-x-4 m-4">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => {
              setShowSignup(true);
              setShowSignupPlus(false);
            }}
          >
            Back to email and password
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={submitButtonHandler}
          >
            Sign up
          </button>
        </div>
      </div>
      <div>
        <h2 className="mt-0 text-center text-xl font-semibold">
          Add some locations
        </h2>
        <div className="mt-5 flex flex-col space-y-4">
          {Array.from({ length: locationCount }).map((_, index) => (
            <LocationInput
              key={index}
              fetchRequest={fetchRequest}
              getLocationMarkers={getLocationMarkers}
              inputLocations={inputLocations}
              index={index}
              name={name}
            />
          ))}
          {locationCount < MAX_LOCATIONS && (
            <button className="btn btn-primary" onClick={addALocationHandler}>
              Add a location
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupPlus;
