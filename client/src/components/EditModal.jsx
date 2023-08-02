import React from "react";
import PictureUploader from "./PictureUploader";

function EditModal(props) {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5500';

  const saveChangesHandler = async (event) => {
    try {
      event.preventDefault();
      event.target.form[0].value;
      event.target.form[2].value;
      props.handler(
        event.target.form[0].value,
        event.target.form[2].value,
        props.pictureState
      );
      props.markerArr[props.index].title = event.target.form[0].value;
      props.markerArr[props.index].description = event.target.form[2].value;
      props.markerArr[props.index].image = props.pictureState;
      props.setIsEdit(false);

      const body = {
        markerIndex: props.index,
        updatedMarkerData: props.markerArr[props.index],
      };
      const updateUrl = `${API_BASE_URL}/api/user/marker/${props.userState._id}`;
      const updatedMarker = await props.fetchRequest("PUT", updateUrl, body);
      console.log(updatedMarker);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form>
      <div className="modal-header">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-lg">
              Memory
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            id="memory-title"
            defaultValue={
              props.tempDescription ? props.tempDescription.title : props.title
            }
          />
        </div>
      </div>
      <div className="modal-body">
        <PictureUploader
          pictureState={props.pictureState}
          setPictureState={props.setPictureState}
        />
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Description</span>
          </div>
          <textarea
            id="home-textArea"
            className="form-control"
            defaultValue={
              props.tempDescription
                ? props.tempDescription.description
                : props.description
            }
          />
        </div>
      </div>
      <div className="custom-modal-footer">
        <button
          id="left-button"
          type="button"
          className="btn btn-danger"
          onClick={props.deleteButtonHandler}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => props.setActiveModal(-1)}
        >
          Close
        </button>
        <button
          id="right-button"
          type="submit"
          className="btn btn-success"
          onClick={(event) => saveChangesHandler(event)}
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

export default EditModal;
