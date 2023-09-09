import React, { useRef, useEffect } from "react";
import { GET_MARKER_BY_ID } from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";

function DisplayModal({ markerId, handleClose }) {
  const modalContentRef = useRef(null);

  const { loading, error, data } = useQuery(GET_MARKER_BY_ID, {
    variables: { markerId: markerId },
  });
  useEffect(() => {
    if (data) {
      console.log(data.getMarkerById);
    }
  }, [data]);

  return (
    <>
      {data && (
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
            {/* Modal Content */}
            <div className="modal modal-open">
              <div
                className="modal-box  bg-gray-800 rounded shadow-lg max-w-xl w-full text-white"
                ref={modalContentRef}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {data.getMarkerById.title}
                  </h2>
                  <div className="text-right">
                    <h6>{data.getMarkerById.user.username}</h6>
                    <p>{data.getMarkerById.createdAt}</p>
                  </div>
                </div>

                <div>

                    <div className="mb-4">
                      <img
                        className="w-full h-auto"
                        src={data.getMarkerById.media}
                        alt="Memory Image"
                      />
                    </div>

                  <div className="p-4">
                    <p>{data.getMarkerById.description}</p>
                  </div>
                </div>

                <div className="flex justify-between p-4 w-full h-full">
                  <button
                    type="button"
                    className="btn text-white w-1/2"
                    onClick={() => handleClose()}
                  >
                    Close
                  </button>
                  {/* Make the is edit move to here */}
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
      )}
    </>
  );
}

export default DisplayModal;
