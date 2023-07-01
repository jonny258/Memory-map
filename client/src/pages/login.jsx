import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault(); // Prevent form submission

      const body = {
        email: email,
        password: password,
      };

      fetch("http://localhost:5500/api/user/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      })
      .then(response => response.json())
      .then(data => {
        if(!data._id){
          alert(data)
        }else{
          console.log(data)
          window.location.href = '/home'
        }
      })
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={submitButtonHandler}>
        <div className="form-group">
          <label htmlFor="userEmail">Email address</label>
          <input
            //   type="email"
            className="form-control"
            id="userEmail"
            placeholder="Enter email"
            value={email}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div>
        <h6>Don't have an account yet? Sign up here</h6>
        <a className="btn btn-primary" href="/signup">
            Sign up
        </a>

      </div>
    </>
  );
}

export default Login;
