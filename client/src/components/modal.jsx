import React, { useState } from "react";

class Memory { //This is the constucor that makes the memories
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
    // const newMemory = new Memory(
    const memoryTitle = document.getElementById("memory-title").value;
    const memoryDescription =
      document.getElementById("memory-description").value;
    //   activeLngLat
    // );
    // console.log(newMemory);
    // setMemoryArr((prevMemoryArr) => [...prevMemoryArr, newMemory]);
    // console.log(memoryArr);
    console.log(activeLngLat)
    if (memoryTitle && memoryDescription) {
      console.log(activeLngLat)
      const newMemory = new Memory(
        memoryTitle,
        memoryDescription,
        mapObject.lngLat,
      );
      setModalData(newMemory);
      // console.log(newMemory);
      makeMarker(mapObject, newMemory);
      setIsEdit(false);
    } else {
      alert("please fillout both fields to make a memory");
    }
  };
  return (
    <>
      <div
        className="modal-backdrop-custom fade show"
        // onClick={(event) => {
        //   //This code is never hit and that is why I can't close the background
        //   event.stopPropagation();
        //   console.log("hehe");
        // }}
      ></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        // onClick={(event) => {
        //   event.stopPropagation();
        //   console.log("yoyo");
        // }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-sizing">
            {!isEdit && (
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
            {isEdit && (
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
                      // value={modalData.title}
                      defaultValue={modalData.title}
                      // onChange={(event) => {
                      //   // Update the value of modalData.title
                      //   const updatedModalData = {
                      //     ...modalData,
                      //     title: event.target.value,
                      //   };
                      //   // Handle the onChange event if needed
                      //   // For example, you can update the state or perform any other operations
                      //   console.log(updatedModalData.title);
                      //   // Update the modalData state or perform any other necessary actions
                      // }}
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
                      // onChange={(event) => {
                      //   // Update the value of modalData.description
                      //   const updatedModalData = {
                      //     ...modalData,
                      //     description: event.target.value,
                      //   };
                      //   // Handle the onChange event if needed
                      //   // For example, you can update the state or perform any other operations
                      //   console.log(updatedModalData.description);
                      //   // Update the modalData state or perform any other necessary actions
                      // }}
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
