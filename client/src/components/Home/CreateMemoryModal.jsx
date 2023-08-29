import React, { useState } from "react";
import PictureUploader from "../PictureUploader";

function CreateMemoryModal({
  handleClose,
  coordinatesRef,
  userState,
  fetchRequest,
  setMarkersArr,
}) {
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";

  const [pictureState, setPictureState] = useState("");
  //Make the closing of the modal better

  class MakeMarker {
    constructor(lat, lng, title, description, date, name, image) {
      (this.lat = lat),
        (this.lng = lng),
        (this.title = title),
        (this.description = description),
        (this.date = date),
        (this.name = name),
        (this.image = image);
    }
  }

  const saveMemoryHandler = async (event) => {
    event.preventDefault();
    try {
      const title = event.target.form[0].value;
      const description = event.target.form[2].value;
      if (title && description) {
        const currentDate = new Date();
        const formattedDate = `${
          currentDate.getMonth() + 1
        }/${currentDate.getDate()}`;

        const newMarker = new MakeMarker(
          coordinatesRef.current[0],
          coordinatesRef.current[1],
          title,
          description,
          formattedDate,
          userState.name,
          pictureState
        );

        const markerURL = `${API_BASE_URL}/api/user/marker/${userState._id}`;
        const postedNewMarker = await fetchRequest(
          "POST",
          markerURL,
          newMarker
        );
        console.log(postedNewMarker);

        setMarkersArr((prev) => [...prev, newMarker]);
        handleClose(false);
      } else {
        alert("Please fillout both fields");
      }
    } catch (err) {
      console.error(err);
    }
  };
  //   return (

  //       <form method="dialog" className="modal-box">
  //         <h3 className="font-bold text-lg">Hello!</h3>
  //         <p className="py-4">Press ESC key or click the button below to close</p>
  //         <div className="modal-action">
  //           {/* if there is a button in form, it will close the modal */}
  //           <button className="btn">Close</button>
  //         </div>
  //       </form>

  //   );

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        tabIndex="-1"
        role="dialog"
        onClick={(event) => {
          event.target.className.includes("flex items-center justify-center") &&
            handleClose();
        }}
      >
        <div className="modal modal-open">
          <div className="modal-box">
            <form>
              <div className="mb-4">
                <label className="label text-white">Memory</label>
                <input type="text" className="input input-bordered w-full text-white" />
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
