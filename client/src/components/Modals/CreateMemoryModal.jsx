import React, { useState, useRef } from "react";
import PictureUploader from "../Helpers/PictureUploader";
import { CREATE_MARKER } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { markersInMapVar } from "../../App";
import { userDataVar } from "../../main";

//I need to get the users color from this 
function CreateMemoryModal({
  handleClose,
  coordinatesRef,
}) {
  console.log(markersInMapVar());

  const [createMarker, { data, loading, error }] = useMutation(CREATE_MARKER);
  const [pictureState, setPictureState] = useState("");
  const modalContentRef = useRef(null);
  const titleRef = useRef();
  const descriptionRef = useRef();

  const saveMemoryHandler = async (event) => {
    event.preventDefault();
    try {

      if (titleRef.current.value && descriptionRef.current.value) {


        const userId = Auth.getProfile().data._id;
        const input = {
          lat: coordinatesRef.current[0],
          lng: coordinatesRef.current[1],
          media: pictureState,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
        };

        console.log({ userId, input });

        if(input.lat && input.lng && input.media && input.title && input.description){

          const response = await createMarker({ variables: { userId, input } });
          if(response.data){
            if(markersInMapVar().getAllMarkers){
              markersInMapVar(markersInMapVar().getAllMarkers)
            }
            console.log(markersInMapVar())
            const tempMarkersArr = [...markersInMapVar(), response.data.createMarker]
            markersInMapVar(tempMarkersArr)
            const tempUserDataVar = { ...userDataVar() };
            tempUserDataVar.markers = [...tempUserDataVar.markers, response.data.createMarker];
            userDataVar(tempUserDataVar);
            handleClose();
          }else{
            alert(response.errors)
          }
        }else{
          alert("Please fill out all fields")
        }
      } else {
        alert("Please fillout both fields");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
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
