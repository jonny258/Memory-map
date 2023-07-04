import React, { useState, useRef } from "react";
import "../assets/css/login-signup.css";
import { ChromePicker } from "react-color";

function Signup() {
  const [color, setColor] = useState("#000000");

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault(); // Prevent form submission

      const body = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        color: color
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="wrapper">
        <section>
          <form className="d-flex">
            <div>
              <div className="form-group">
                <label htmlFor="userName">Name</label>
                <input
                  ref={nameRef}
                  className="form-control"
                  id="userName"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group color-picker">
              <ChromePicker color={color} onChange={handleColorChange}/>
              </div>
            </div>
            <div className="email-password">
              <div className="form-group">
                <label htmlFor="userEmail">Email address</label>
                <input
                  //   type="email"
                  ref={emailRef}
                  className="form-control"
                  id="userEmail"
                  placeholder="Enter email"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="userPassword">Password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  className="form-control"
                  id="userPassword"
                  placeholder="Password"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={submitButtonHandler}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
          <div className="other-option">
            <h6>Already have an account? Login here</h6>
            <a className="btn btn-primary" href="/login">
              Go To Login
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default Signup;
