import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";

function ProfileModal({ setProfileModalOpen, user, markerArr }) {
  //make this work for this modal
  const [color, setColor] = useState(user.color);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");

  const modalBackgroundHandler = (event) => {
    if (event.target.className === "modal fade show") {
      setProfileModalOpen(false);
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const editProfileButtonHandler = async () => {
    const updatedNameMarkers = markerArr.map((marker) => {
      marker.name = nameRef.current.value;
      return marker;
    });

    console.log(updatedNameMarkers);

    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      color: color,
      markers: updatedNameMarkers,
    };

    await fetch(`http://localhost:5500/api/user/${user._id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
    setProfileModalOpen(false);
    window.location.reload();
  };
  return (
    <>
      <div className="modal-backdrop-custom fade show"></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        onClick={modalBackgroundHandler}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ minWidth: "fit-content" }}
        >
          <div className="modal-content modal-sizing">
            <h2 className="edit-profile-title">Edit your profile</h2>
            <div className="d-flex edit-body">
              <div className="edit-profile-inputs">
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Email
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    ref={emailRef}
                    defaultValue={user.email}
                  />
                </div>
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Password
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    ref={passwordRef}
                    defaultValue={user.password}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ width: '70px' }}
                    onClick={()=> {setShowPassword(!showPassword)}}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Name
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    ref={nameRef}
                    defaultValue={user.name}
                  />
                </div>
              </div>
              <div>
                <ChromePicker
                  color={color}
                  onChange={handleColorChange}
                  className="myChromePicker"
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              id="edit-profile-button"
              onClick={editProfileButtonHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;
