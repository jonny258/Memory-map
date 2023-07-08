import React, { useRef } from "react";

function EditModal({
  isEdit,
  setIsEdit,
  setActiveModal,
  title,
  description,
  index,
  markerArr,
  setMarkersArr,
  handler,
  tempDescription,
  deleteButtonHandler,
  userState,
}) {
  const memoryTitleRef = useRef("");
  const memoryDescriptionRef = useRef("");

  const saveChangesHandler = () => {
    console.log("this will be the edit");
    handler(memoryTitleRef.current.value, memoryDescriptionRef.current.value);
    markerArr[index].title = memoryTitleRef.current.value;
    markerArr[index].description = memoryDescriptionRef.current.value;
    setIsEdit(false);

    const url = `http://localhost:5500/api/user/marker/${userState._id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        markerIndex: index,
        updatedMarkerData: markerArr[index]
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="modal-header">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-lg">
              Memory
            </span>
          </div>
          <input
            ref={memoryTitleRef}
            type="text"
            className="form-control"
            id="memory-title"
            defaultValue={tempDescription ? tempDescription.title : title}
          />
        </div>
      </div>
      <div className="modal-body">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Description</span>
          </div>
          <textarea
            ref={memoryDescriptionRef}
            id="home-textArea"
            className="form-control"
            defaultValue={
              tempDescription ? tempDescription.description : description
            }
          />
        </div>
      </div>
      <div className="custom-modal-footer">
        <button
          id="left-button"
          type="button"
          className="btn btn-danger"
          onClick={deleteButtonHandler}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setActiveModal(-1)}
        >
          Close
        </button>
        <button
          id="right-button"
          type="button"
          className="btn btn-success"
          onClick={saveChangesHandler}
        >
          Save changes
        </button>
      </div>
    </>
  );
}

export default EditModal;
