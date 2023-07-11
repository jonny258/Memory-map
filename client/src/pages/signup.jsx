import React, { useState, useRef } from "react";
import "../assets/css/login-signup.css";
import { ChromePicker } from "react-color";
import { useNavigate } from "react-router-dom";
import LocationInput from "../components/LocationInput";

function Signup({fetchRequest, setUserState}) {
  const MAX_LOCATIONS = 5;
  const navigate = useNavigate();

  const [color, setColor] = useState("#000000");
  const [pageState, setPageState] = useState(true);
  const [locationCount, setLocationCount] = useState(0);
  const [inputLocations, setInputLocations] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      console.log([event.target.form]);
      if (email && password && name) {
        const namedMarkers = inputLocations
          .filter((marker) => marker.name && marker.name.trim() !== "")
          .map((marker) => {
            marker.name = name;
            return marker;
          });

        const body = {
          email: email,
          password: password,
          name: name,
          color: color,
          markers: namedMarkers,
        };
        const signUpUrl = `http://localhost:5500/api/user/signup`

        const userData = await fetchRequest('POST', signUpUrl, body)
        console.log(userData)
        setUserState(userData)
        navigate('/home')
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
      <div className="wrapper">
        <section>
          <form className="d-flex">
            {pageState ? (
              <div className="email-password">
                <div className="form-group">
                  <label htmlFor="userEmail">Email address</label>
                  <input
                    //   type="email"
                    className="form-control"
                    id="userEmail"
                    placeholder="Enter email"
                    defaultValue={email && email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="userPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userPassword"
                    placeholder="Password"
                    defaultValue={password && password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={emailPasswordHandler}
                  >
                    Continue
                  </button>
                  <div className="other-option">
                    <h6>Already have an account? Login here</h6>
                    <a className="btn btn-primary" href="/login">
                      Go To Login
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="about-you">
                <div>
                  <h2>About you</h2>
                  <div className="form-group">
                    <label htmlFor="userName">Name</label>
                    <input
                      className="form-control"
                      id="userName"
                      placeholder="Enter your name"
                      defaultValue={name && name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="form-group color-picker">
                    <ChromePicker
                      color={color}
                      onChange={(event) => setColor(event.hex)}
                      className="myChromePicker"
                    />
                  </div>
                  <div className="form-group d-flex">
                    <button
                      className="btn btn-primary"
                      onClick={() => setPageState(true)}
                    >
                      Back to email and password
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      onClick={submitButtonHandler}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
                <div>
                  <h2>Add some locations</h2>
                  <div className="location-wrapper">
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
