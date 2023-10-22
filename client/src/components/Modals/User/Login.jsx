import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../../utils/auth";
import { userDataVar } from "../../../main";

function Login({ setShowLogin, setShowSignup, handleClose }) {
  // const API_BASE_URL =
  //   import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";
  // const navigate = useNavigate();
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      if (emailRef.current.value && passwordRef.current.value) {
        const body = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
        //const loginUrl = `${API_BASE_URL}/api/user/login`;
        const response = await loginUser({
          variables: body,
        });
        console.log(response);
        Auth.login(response.data.loginUser.token);
        userDataVar(response.data.loginUser.user);
        handleClose();
      } else {
        alert("Please fillout both feilds");
      }
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <>
      <div className="bg-gray-600 rounded-md border-none m-4 p-3">
        <label className="label">
          <span className="label-text text-lg">Email address</span>
        </label>
        <input
          ref={emailRef}
          type="text"
          placeholder="Enter email"
          className="input input-bordered input-accent w-full text-white"
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
          ref={passwordRef}
          type="password"
          placeholder="Enter Password"
          className="input input-bordered input-accent w-full text-white mb-3"
        />
        <button
          className="w-full btn btn-primary"
          onClick={submitButtonHandler}
        >
          Continue
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <h6 className="mb-2">Already have an account? Login here</h6>
        <button
          className="w-full btn btn-primary"
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        >
          Go To Sign Up
        </button>
      </div>
    </>
  );
}

export default Login;
