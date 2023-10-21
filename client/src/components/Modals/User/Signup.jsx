import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { GET_ALL_USERS } from "../../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { userInputVar } from "./UserModal";
import { useReactiveVar } from "@apollo/client";

function Signup({ setShowLogin, setShowSignup, setShowSignupPlus }) {
  const emailRef = useRef();
  const passwordRef = useRef();

  const emailPasswordHandler = (event) => {
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRef.current.value && passwordRef.current.value) {
      if (!emailPattern.test(emailRef.current.value)) {
        alert("Please enter a valid email address");
        return;
      }

      const userInput = userInputVar();
      userInput.email = emailRef.current.value;
      userInput.password = passwordRef.current.value;
      userInputVar(userInput);
      setShowSignup(false);
      setShowSignupPlus(true);
      console.log(userInputVar());
    } else {
      alert("Please fill out both fields");
    }
  };
  // useEffect(() => {
  //   console.log(data);
  //   console.log(error);
  //   console.log(loading)
  // }, [data, error, loading]);

  //ADD VALIDATION FOR IF THE EMAIL IS CORRECT HERE
  return (
    <div>
      {/* <div className="bg-gray-600 p-4 m-4 rounded-md">
        <button
          className="w-full btn btn-accent"
          onClick={() => navigate("/social")}
        >
          <h2 className="text-xl">Go to Social page</h2>
        </button>
        <p className="text-lg w-full text-gray-400">
          Skip the sign up and check out the social page
        </p>
      </div> */}
      <div className="bg-gray-600 rounded-md border-none m-4 p-3">
        <label className="label">
          <span className="label-text text-lg">Email address</span>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          className="input input-bordered input-accent w-full text-white"
          ref={emailRef}
          defaultValue={userInputVar().email}
        />
        <label className="label">
          <span className="label-text-alt">
            We'll never share your email with anyone else.
          </span>
        </label>
      </div>
      <div className="bg-gray-600 rounded-md border-none m-4 p-3">
        <label className="label">
          <span className="label-text text-lg">Password</span>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          className="input input-bordered input-accent w-full text-white mb-3"
          ref={passwordRef}
          defaultValue={userInputVar().password}
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
          onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        >
          Go To Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
