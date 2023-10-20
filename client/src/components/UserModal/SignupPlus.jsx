import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";
import { useNavigate } from "react-router-dom";
import LocationInput from "./LocationInput";
import PictureUploader from "../PictureUploader";
import { gql, useMutation } from "@apollo/client";
import { CREATE_USER } from "../../GraphQL/Mutations";
import { userInputVar } from "../../pages/UserModal";
import Auth from "../../utils/auth";

import { userDataVar } from "../../main";

function SignupPlus({ setShowSignup, setShowSignupPlus, handleClose }) {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  // const MAX_LOCATIONS = 5;
  // const [locationCount, setLocationCount] = useState(0);
  // const [inputLocations, setInputLocations] = useState([]);
  const [pictureState, setPictureState] = useState("");
  const [color, setColor] = useState(userInputVar().color || "#000000");
  const usernameRef = useRef();
  // const colorRef = useRef();

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      if (
        userInputVar().email &&
        userInputVar().password &&
        color &&
        usernameRef.current.value
      ) {
        console.log(pictureState);
        const body = {
          email: userInputVar().email,
          password: userInputVar().password,
          username: usernameRef.current.value,
          color: color,
          pfp: pictureState || userInputVar().pfp,
        };

        if (
          body.email &&
          body.password &&
          body.username &&
          body.color &&
          body.pfp
        ) {
          const response = await createUser({ variables: { input: body } });
          if(response.data){
            Auth.login(response.data.createUser.token);
            userDataVar(response.data.createUser.user);
            handleClose()
          }else{
            alert(response.errors)
          }
        }else{
          alert("Please fill out all fields")
        }
      } else {
        alert("Please fill out all required fields");
      }
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const emailAndPasswordHandler = () => {
    const userInput = userInputVar();
    userInput.color = color;
    userInput.username = usernameRef.current.value;
    if (pictureState) {
      userInput.pfp = pictureState;
    }
    userInputVar(userInput);
    setShowSignup(true);
    setShowSignupPlus(false);
  };

  // const getLocationMarkers = (data, index) => {
  //   inputLocations[index] = data;
  // };

  // const addALocationHandler = (event) => {
  //   event.preventDefault();
  //   if (locationCount < MAX_LOCATIONS) {
  //     setLocationCount((prevCount) => prevCount + 1);
  //   }
  // };

  return (
    <div className="flex space-x-5">
      <div className="flex-grow">
        <h2 className="mt-0 text-center text-xl font-semibold">About you</h2>

        <div className="bg-gray-600 rounded-md border-none m-4 p-3">
          <label className="label">
            <span className="label-text text-lg">Username</span>
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="input input-bordered input-accent w-full text-white"
            ref={usernameRef}
            defaultValue={userInputVar().username}
          />
        </div>
        <div className="bg-gray-600 p-4 m-4 rounded-md">
          <PictureUploader
            uploadText={"Pick a profile picture"}
            pictureState={userInputVar().pfp}
            setPictureState={setPictureState}
          />
        </div>
        <div className="flex items-center justify-center bg-gray-600 p-4 m-4 rounded-md">
          <ChromePicker
            color={color}
            onChange={(event) => setColor(event.hex)}
          />
        </div>
        <div className="flex gap-4 m-4 justify-center">
          <button
            className="btn btn-outline btn-accent w-1/2"
            onClick={emailAndPasswordHandler}
          >
            Back to email and password
          </button>
          <button
            type="submit"
            className="btn btn-primary w-1/2"
            onClick={submitButtonHandler}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPlus;
