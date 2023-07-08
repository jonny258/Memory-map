import React, { useState, useRef } from "react";
import "../assets/css/login-signup.css";
import { ChromePicker } from "react-color";
import LocationInput from "../components/LocationInput";

function Signup() {
  const [color, setColor] = useState("#000000");
  const [pageState, setPageState] = useState(true);
  const [locationCountState, setLocationCountState] = useState([]);
  const [inputLocations, setInputLocations] = useState([]);

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      if (email && password && name) {
        const namedMarkers = inputLocations
        .filter((marker) => marker.name && marker.name.trim() !== '')
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

        await fetch("http://localhost:5500/api/user/signup", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data._id) {
              alert(data);
            } else {
              console.log(data);
              window.location.href = "/home";
            }
          });
      }else{
        alert("Please fill out all required fields")
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
    setLocationCountState((prev) => [...prev, ""]);
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
                    type="submit"
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
                      onChange={handleColorChange}
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
                    {/* The name ref kind of passes weird */}
                    {locationCountState.map((inputText, index) => {
                      return (
                        <LocationInput
                          key={index}
                          getLocationMarkers={getLocationMarkers}
                          inputLocations={inputLocations}
                          index={index}
                          name={name}
                        />
                      );
                    })}
                    {locationCountState.length < 5 && (
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
