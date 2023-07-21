import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";
import PictureUploader from "./PictureUploader";

function ProfileModal({
  setProfileModalOpen,
  user,
  markerArr,
  fetchRequest,
  getSession,
}) {
  const [color, setColor] = useState(user.color);
  const [showPassword, setShowPassword] = useState(false);
  const [pictureState, setPictureState] = useState("");

  const editProfileButtonHandler = async (event) => {
    try {
      event.preventDefault();
      const email = event.target.form[0].value;
      const password = event.target.form[1].value;
      const name = event.target.form[3].value;
      if (email && password && name) {
        const updatedNameMarkers = markerArr.map((marker) => {
          marker.name = name;
          return marker;
        });

        const body = {
          email: email,
          password: password,
          name: name,
          color: color,
          pfp: pictureState,
          markers: updatedNameMarkers,
        };

        const updateUserUrl = `http://localhost:5500/api/user/${user._id}`;

        const updatedUserData = await fetchRequest("PUT", updateUserUrl, body);
        console.log(updatedUserData);
        setProfileModalOpen(false);
        getSession();
      } else {
        alert("Please fill out all fields");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="modal-backdrop-custom fade show"></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        onClick={(event) =>
          event.target.className === "modal fade show" &&
          setProfileModalOpen(false)
        }
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ minWidth: "fit-content" }}
        >
          <form className="modal-content modal-sizing">
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
                    defaultValue={user.password}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ width: "70px" }}
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
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
                    defaultValue={user.name}
                  />
                </div>
                <PictureUploader
                  uploadText={"Change your profile picture"}
                  pictureState={pictureState}
                  setPictureState={setPictureState}
                />
              </div>
              <div>
                <ChromePicker
                  color={color}
                  onChange={(event) => setColor(event.hex)}
                  className="myChromePicker"
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              id="edit-profile-button"
              type="submit"
              onClick={(event) => editProfileButtonHandler(event)}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;
