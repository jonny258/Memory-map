import React from "react";

function DisplayModal(props) {
  return (
    <>
      <div className="modal-header d-flex justify-content-between">
        <h2 className="modal-title" id="modalDataTitle">
          {props.tempDescription ? props.tempDescription.title : props.title}
        </h2>
        <div className="text-end">
          <h6>{props.name ? props.name : 'Default Name'}</h6>
          <p>{props.date}</p>
        </div>
      </div>
      <div className="modal-body" id="modalDataBody">
        <div className="display-picture">
          <img src={props.tempDescription ? props.tempDescription.image : props.imageSrc} />
        </div>
        <p>{props.tempDescription ? props.tempDescription.description : props.description}</p> 
      </div>
      <div className="custom-modal-footer">
        <button
          id="left-button"
          type="button"
          className="btn btn-secondary"
          onClick={() => props.setActiveModal(-1)}
        >
          Close
        </button>
        <button
          id="right-button"
          type="button"
          className="btn btn-success"
          onClick={() => props.setIsEdit(true)}
        >
          Edit
        </button>
      </div>
    </>
  );
}

export default DisplayModal;
