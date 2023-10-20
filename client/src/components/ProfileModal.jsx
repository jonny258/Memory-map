import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import PictureUploader from "./PictureUploader";
import { GET_USER_BY_ID } from "../GraphQL/Queries";
import { EDIT_USER } from "../GraphQL/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import Auth from '../utils/auth'
import { userDataVar } from "../main";

function ProfileModal({
  userId,
  handleClose,
}) {
  console.log(userDataVar())
  // const { loading, error, data } = useQuery(GET_USER_BY_ID, {
  //   variables: { userId: userId },
  // });
  const [editUser, { data: editData, loading: loadingData, error: errorData }] =
    useMutation(EDIT_USER);

  useEffect(() => {
    if (userDataVar()) {
      console.log(userDataVar());
      setColor(userDataVar().color);
    }
    //console.log(data);
  }, [userDataVar()]);

  console.log(userId);
  //Set this to the user that  is logged in
  const [color, setColor] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pictureState, setPictureState] = useState("");

  const modalContentRef = useRef(null);

  const passwordRef = useRef("");
  const emailRef = useRef("");
  const usernameRef = useRef("");

  const editProfileButtonHandler = async (event) => {
    try {
      const body = {
        email: emailRef.current.value,
        username: usernameRef.current.value,
        color: color,
      };

      if (passwordRef.current.value) {
        body.password = passwordRef.current.value;
      }

      if (pictureState) {
        body.pfp = pictureState;
      }
      console.log(body);

      const response = await editUser({
        variables: {
          input: body,
          userId: userId,
        },
      });
      // console.log(response.data.editUser);
      if(response.data){
        Auth.login(response.data.editUser.token)
        userDataVar(response.data.editUser.user)
        handleClose()
      }else{
        alert(response.error)
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {userDataVar() && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
            tabIndex="-1"
            role="dialog"
            onClick={(event) => {
              if (
                modalContentRef.current &&
                !modalContentRef.current.contains(event.target)
              ) {
                handleClose();
              }
            }}
          >
            <div className="modal modal-open">
              <div className="modal-box" ref={modalContentRef}>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Edit your profile
                  </h2>

                  <div className="mb-4">
                    <label className="label">Email</label>
                    <input
                      type="text"
                      ref={emailRef}
                      className="input input-bordered w-full"
                      defaultValue={userDataVar().email}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="label">Password</label>
                    <div className="flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        ref={passwordRef}
                        className="input input-bordered w-full"
                      />
                      <button
                        type="button"
                        className="btn ml-2"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="label">Username</label>
                    <input
                      type="text"
                      ref={usernameRef}
                      className="input input-bordered w-full"
                      defaultValue={userDataVar().username}
                    />
                  </div>

                  <div className="mb-4">
                    <PictureUploader
                      uploadText={"Change your profile picture"}
                      pictureState={pictureState}
                      setPictureState={setPictureState}
                    />
                  </div>

                  <div className="flex items-center justify-center bg-gray-600 p-4 m-4 rounded-md">
                    <ChromePicker
                      color={color}
                      onChange={(event) => setColor(event.hex)}
                      className="myChromePicker"
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={(event) => editProfileButtonHandler(event)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProfileModal;
