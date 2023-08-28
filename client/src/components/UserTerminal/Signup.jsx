import React, { useState } from "react";

function Signup({
  setShowLogin,
  setShowSignup,
  setShowSignupPlus,
  email,
  password,
  setEmail,
  setPassword,
}) {
  const emailPasswordHandler = (event) => {
    event.preventDefault();
    if (email && password) {
      setShowSignup(false);
      setShowSignupPlus(true);
    } else {
      alert("Please fill out both fields");
    }
  };

  return (
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
      <div className="bg-gray-600 rounded-md border-none m-4 p-3">
        <label className="label">
          <span className="label-text text-lg">Email address</span>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          className="input input-bordered input-accent w-full text-white"
          defaultValue={email && email}
          onChange={(event) => setEmail(event.target.value)}
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
          defaultValue={password && password}
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
