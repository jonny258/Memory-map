import React, { useState } from "react";

class Memory {
  constructor(title, description, lngLat) {
    (this.title = title),
      (this.description = description),
      (this.lngLat = lngLat);
  }
}

function Modal({ handleBackgroundClick, closeModal, activeLngLat, isOpen, memoryArr, setMemoryArr }) {
  const [isEdit, setIsEdit] = useState(false);
//   const [memoryArr, setMemoryArr] = useState([])

  const editButtonHandler = () => {
    setIsEdit(true);
  };

  const saveChangesHandler = (event) => {
    const newMemory = new Memory(document.getElementById('memory-title').value, document.getElementById('memory-description').value, activeLngLat)
    console.log(newMemory)
    setMemoryArr(prevMemoryArr => [...prevMemoryArr, newMemory])
    console.log(memoryArr)
    // setIsEdit(false);
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
                  <h5 className="modal-title">
                    This is where the title will go
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
                <div className="modal-body">
                  {/* This is where the description will go  */}
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
                    ></textarea>
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
