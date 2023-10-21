import React, { useRef, useEffect, useState } from "react";
import { GET_MARKER_BY_ID } from "../../../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import EditBody from "./EditBody";
import DisplayBody from "./DisplayBody";

function DisplayModal({ markerId, handleClose }) {
  const modalContentRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="fixed z-40 top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <div
        className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
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
          <div
            className="modal-box  bg-gray-800 rounded shadow-lg max-w-xl w-full text-white"
            ref={modalContentRef}
          >
            {showEditModal ? (
              <EditBody
                markerId={markerId}
                handleClose={handleClose}
                setShowEditModal={setShowEditModal}
              />
            ) : (
              <DisplayBody
                markerId={markerId}
                handleClose={handleClose}
                setShowEditModal={setShowEditModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayModal;
