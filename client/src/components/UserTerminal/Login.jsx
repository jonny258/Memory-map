import React from "react";
import { useNavigate } from "react-router-dom";

function Login({ fetchRequest, setUserState, setShowLogin, setShowSignup }) {
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";
  const navigate = useNavigate();

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      const email = event.target.form[0].value;
      const password = event.target.form[1].value;
      if (email && password) {
        const body = {
          email: email,
          password: password,
        };

        const loginUrl = `${API_BASE_URL}/api/user/login`;
        const userData = await fetchRequest("POST", loginUrl, body);
        console.log(userData);
        if (userData._id) {
          setUserState(userData);
          navigate("/home");
        } else {
          alert(userData);
        }
      } else {
        alert("Please fillout both feilds");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-gray-600 rounded-md border-none m-4 p-3">
        <label className="label">
          <span className="label-text text-lg">Email address</span>
        </label>
        <input
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
          type="text"
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
