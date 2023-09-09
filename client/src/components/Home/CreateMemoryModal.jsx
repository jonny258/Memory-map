import React, { useState, useRef } from "react";
import PictureUploader from "../PictureUploader";
import { CREATE_MARKER } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { markersInMapVar } from "../../App";

function CreateMemoryModal({
  handleClose,
  coordinatesRef,
  //userState,
  //fetchRequest,
  setMarkersArr,
}) {
  console.log(Auth.getProfile().data._id);
  // const API_BASE_URL =
  //   import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";

  const [createMarker, { data, loading, error }] = useMutation(CREATE_MARKER);

  const [pictureState, setPictureState] = useState("");
  const modalContentRef = useRef(null);
  const titleRef = useRef();
  const descriptionRef = useRef();

  // class MakeMarker {
  //   constructor(lat, lng, title, description, date, name, image) {
  //     (this.lat = lat),
  //       (this.lng = lng),
  //       (this.title = title),
  //       (this.description = description),
  //       (this.date = date),
  //       (this.name = name),
  //       (this.image = image);
  //   }
  // }

  const saveMemoryHandler = async (event) => {
    event.preventDefault();
    try {
      // const title = event.target.form[0].value;
      // const description = event.target.form[2].value;
      if (titleRef.current.value && descriptionRef.current.value) {
        const currentDate = new Date();
        const formattedDate = `${
          currentDate.getMonth() + 1
        }/${currentDate.getDate()}`;

        const userId = Auth.getProfile().data._id;
        const input = {
          lat: coordinatesRef.current[0],
          lng: coordinatesRef.current[1],
          media: pictureState,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
        };

        console.log({ userId, input });

        const response = await createMarker({ variables: { userId, input } });
        console.log(response.data.createMarker);
        console.log(markersInMapVar())
        const tempMarkersArr = [...markersInMapVar(), response.data.createMarker]
        markersInMapVar(tempMarkersArr)

        // const newMarker = new MakeMarker(
        //   coordinatesRef.current[0],
        //   coordinatesRef.current[1],
        //   title,
        //   description,
        //   formattedDate,
        //   userState.name,
        //   pictureState
        // );

        // const markerURL = `${API_BASE_URL}/api/user/marker/${userState._id}`;
        // const postedNewMarker = await fetchRequest(
        //   "POST",
        //   markerURL,
        //   newMarker
        // );
        // console.log(postedNewMarker);

        // setMarkersArr((prev) => [...prev, newMarker]);
        handleClose(false);
      } else {
        alert("Please fillout both fields");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
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
            <form>
              <div className="mb-4">
                <label className="label text-white">Memory</label>
                <input
                  type="text"
                  className="input input-bordered w-full text-white"
                  ref={titleRef}
                />
              </div>

              <div className="mb-4">
                <PictureUploader
                  uploadText={"Upload an image..."}
                  pictureState={pictureState}
                  setPictureState={setPictureState}
                />
              </div>

              <div className="mb-4">
                <label className="label text-white">Description</label>
                <textarea
                  id="home-textArea"
                  className="textarea textarea-bordered w-full h-32 text-white"
                  ref={descriptionRef}
                />
              </div>

              <div className="flex justify-between">
                <button
                  id="left-button"
                  type="button"
                  className="btn"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  id="right-button"
                  type="submit"
                  className="btn btn-primary"
                  onClick={saveMemoryHandler}
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateMemoryModal;
