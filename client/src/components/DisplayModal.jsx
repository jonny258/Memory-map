import React, { useRef } from "react";

function DisplayModal(props) {
  const modalContentRef = useRef(null);
  return (
    <>
    {/* Backdrop */}
    <div
      className="fixed z-40 top-0 left-0 w-full h-full bg-black opacity-50"
      
    ></div>

    {/* Modal Container */}
    <div
      className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
      tabIndex="-1"
      role="dialog"
      onClick={(event) => {
        if (
          modalContentRef.current &&
          !modalContentRef.current.contains(event.target)
        ) {
          props.setActiveModal(-1);
        }
      }}
    >
      {/* Modal Content */}
      <div
        className="modal modal-open"
      >
        <div
          className="modal-box  bg-gray-800 rounded shadow-lg max-w-xl w-full text-white"
          ref={modalContentRef}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {props.tempDescription
                ? props.tempDescription.title
                : props.title}
            </h2>
            <div className="text-right">
              <h6>{props.name ? props.name : "Default Name"}</h6>
              <p>{props.date}</p>
            </div>
          </div>

          <div>
            {props.tempDescription || props.imageSrc ? (
              <div className="mb-4">
                <img
                  className="w-full h-auto"
                  src={
                    props.tempDescription
                      ? props.tempDescription.image
                      : props.imageSrc
                  }
                  alt="Memory Image"
                />
              </div>
            ) : null}
            <div className="p-4">
              <p>
                {props.tempDescription
                  ? props.tempDescription.description
                  : props.description}
              </p>
            </div>
          </div>

          <div className="flex justify-between p-4 w-full h-full">
            <button
              type="button"
              className="btn text-white w-1/2"
              onClick={() => props.setActiveModal(-1)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary w-1/2"
              onClick={() => props.setIsEdit(true)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
</>
  );
}

export default DisplayModal;
