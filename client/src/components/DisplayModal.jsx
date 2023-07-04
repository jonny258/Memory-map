import React from "react";

function DisplayModal({
  isEdit,
  setIsEdit,
  setActiveModal,
  title,
  description,
  tempDescription,
  name,
  date,
}) {
  return (
    <>
      <div className="modal-header d-flex justify-content-between">
        <h2 className="modal-title" id="modalDataTitle">
          {tempDescription ? tempDescription.title : title}
        </h2>
        <div className="text-end">
          {/* I will remove the turninary opperator here once I pull the name from the data base */}
          <h6>{name ? name : 'Default Name'}</h6>
          <p>{date}</p>
        </div>
      </div>
      <div className="modal-body" id="modalDataBody">
        <p>{tempDescription ? tempDescription.description : description}</p> 
      </div>
      <div className="custom-modal-footer">
        <button
          id="left-button"
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
          onClick={() => setIsEdit(true)}
        >
          Edit
        </button>
      </div>
    </>
  );
}

export default DisplayModal;
