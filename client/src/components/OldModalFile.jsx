import React, { useState } from "react";

class Memory {
  //This is the constucor that makes the memories
  constructor(title, description, lngLat) {
    (this.title = title),
      (this.description = description),
      (this.lngLat = lngLat);
  }
}

function Modal({
  handleBackgroundClick, //This will be used but it doesn't work right now
  closeModal,
  activeLngLat,
  isOpen, //This could be useful but is not used right now
  setIsEdit,
  isEdit,
  makeMarker,
  mapObject,
  modalData,
  setModalData,
}) {
  //This is all this does is change the modal to edit
  const editButtonHandler = () => {
    setIsEdit(true);
  };

  const saveChangesHandler = (event) => {
    //Assigns the modal inputs to a value
    const memoryTitle = document.getElementById("memory-title").value;
    const memoryDescription =
      document.getElementById("memory-description").value;
    //Validates that both the fields are filled out
    if (memoryTitle && memoryDescription) {
      const newMemory = new Memory( //Creates the new memory
        memoryTitle,
        memoryDescription,
        mapObject.lngLat
      );
      setModalData(newMemory); //Sets the modalData so that you can view it right after you submit
      makeMarker(mapObject, newMemory); //Calls the makeMarker function that will be called in the home.jsx file
      setIsEdit(false); //Changes the page to edit
    } else {
      alert("please fillout both fields to make a memory"); //This runs if you don't input both fields
    }
  };

  return (
    <>
      <div
        className="modal-backdrop-custom fade show"
        //   //This code is never hit and that is why I can't close when i click the background
        // onClick={(event) => {
        //   event.stopPropagation();
        //   console.log("hehe");
        // }}
      ></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        //This code runs every time you click and the modal is open
        // onClick={(event) => {
        //   event.stopPropagation();
        //   console.log("yoyo");
        // }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-sizing">
            {!isEdit && ( //The Display part of the modal
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="modalDataTitle">
                    {modalData.title}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" id="modalDataBody">
                  {modalData.description}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={editButtonHandler}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
            {isEdit && ( //The edit part of the modal
              <>
                <div className="modal-header">
                  <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-lg"
                      >
                        Memory
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="memory-title"
                      defaultValue={modalData.title}
                    />
                  </div>

                  <button
                    type="button"
                    className="close"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Description</span>
                    </div>
                    <textarea
                      id="memory-description"
                      className="form-control"
                      aria-label="With textarea"
                      defaultValue={modalData.description}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={saveChangesHandler}
                  >
                    Save changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
