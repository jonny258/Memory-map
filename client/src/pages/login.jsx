import React from "react";
import { useNavigate } from "react-router-dom";

function Login({ fetchRequest, setUserState }) {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5500aaa';
  const navigate = useNavigate();

  const submitButtonHandler = async (event) => {
    try {
      event.preventDefault();
      const email = event.target.form[0].value;
      const password = event.target.form[1].value;
      if(email && password){
        const body = {
          email: email,
          password: password,
        };
  
        const loginUrl = `${API_BASE_URL}/api/user/login`;
        const userData = await fetchRequest("POST", loginUrl, body);
        console.log(userData);
        if(userData._id){
          setUserState(userData);
          navigate("/home");
        }else{
          alert(userData)
        }
      }else{
        alert('Please fillout both feilds')
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="wrapper">
        <section>
          <form>
            <div className="form-group">
              <label htmlFor="userEmail">Email address</label>
              <input
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
                Log In
              </button>
            </div>
          </form>
          <div className="other-option">
            <h6>Don't have an account yet? Sign up here</h6>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Go To Sign up
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
