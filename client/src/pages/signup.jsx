import React, { useState, useRef } from "react";
// import "../assets/css/login-signup.css";
import { ChromePicker } from "react-color";
import { useNavigate } from "react-router-dom";
import LocationInput from "../components/UserTerminal/LocationInput";
import PictureUploader from "../components/PictureUploader";

function Signup({ fetchRequest, setUserState }) {
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";

  const MAX_LOCATIONS = 5;
  const navigate = useNavigate();

  const [color, setColor] = useState("#000000");
  const [pageState, setPageState] = useState(true);
  const [locationCount, setLocationCount] = useState(0);
  const [inputLocations, setInputLocations] = useState([]);
  const [pictureState, setPictureState] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

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

  const emailPasswordHandler = (event) => {
    event.preventDefault();
    if (email && password) {
      console.log(API_BASE_URL);
      setPageState(false);
    } else {
      alert("Please fill out both fields");
    }
  };

  const addALocationHandler = (event) => {
    event.preventDefault();
    if (locationCount < MAX_LOCATIONS) {
      setLocationCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-gray-300">
        <section className="p-5 rounded-xl bg-gray-500 max-h-screen">
          <form className="flex flex-col">
            {pageState ? (
              <div>
                <div className="bg-gray-600 p-4 m-4 rounded-md">
                  <button
                    className="w-full btn btn-accent"
                    onClick={() => navigate("/social")}
                  >
                    <h2 className="text-xl">Go to Social page</h2>
                  </button>
                  <p className="text-lg w-full text-gray-400">
                    Skip the sign up and check out the social page
                  </p>
                </div>

                {/* <div className="bg-gray-600 p-4 m-4 rounded-md">
                  <label className="block mb-2 text-white" htmlFor="userEmail">
                    Email address
                  </label>
                  <input
                    className="form-input w-full p-2 rounded mb-2"
                    id="userEmail"
                    placeholder="Enter email"
                    defaultValue={email && email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <small className="block text-sm text-gray-400">
                    We'll never share your email with anyone else.
                  </small>
                </div> */}

                <div className="bg-gray-600 rounded-md border-none m-4 p-3">
                  <label className="label">
                    <span className="label-text text-lg">Email address</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email"
                    className="input input-bordered input-accent w-full text-white"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      We'll never share your email with anyone else.
                    </span>
                  </label>
                </div>

                {/* <div className="bg-gray-600 p-4 m-4 rounded-md">
                  <label
                    className="block mb-2 text-white"
                    htmlFor="userPassword"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input w-full p-2 rounded mb-2"
                    id="userPassword"
                    placeholder="Password"
                    defaultValue={password && password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="w-full py-2 mt-2 bg-blue-500 text-white rounded"
                    onClick={emailPasswordHandler}
                  >
                    Continue
                  </button>
                </div> */}

                <div className="bg-gray-600 rounded-md border-none m-4 p-3">
                  <label className="label">
                    <span className="label-text text-lg">Password</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Password"
                    className="input input-bordered input-accent w-full text-white mb-3"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="w-full btn btn-primary"
                    onClick={emailPasswordHandler}
                  >
                    Continue
                  </button>
                </div>

                <div className="flex flex-col items-center mt-4">
                  <h6 className="mb-2">Already have an account? Login here</h6>
                  <button
                    className="w-full btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Go To Login
                  </button>
                </div>
              </div>
            ) : (
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
                      onClick={() => setPageState(true)}
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
                      <button
                        className="btn btn-primary"
                        onClick={addALocationHandler}
                      >
                        Add a location
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>
      </div>
    </>
  );
}

export default Signup;
