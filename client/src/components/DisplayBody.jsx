import React, { useEffect } from "react";
import { GET_MARKER_BY_ID } from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Auth from "../utils/auth";

function DisplayBody({ handleClose, markerId, setShowEditModal }) {
  const { loading, error, data } = useQuery(GET_MARKER_BY_ID, {
    variables: { markerId: markerId },
  });
  useEffect(() => {
    if (data) {
      console.log(data.getMarkerById);
    }
  }, [data]);

  const formatDate = (timestamp) => {
    let date = new Date(parseInt(timestamp));

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${month}/${day} ${hour}:${formattedMinute}`;
  };

  return (
    <>
      {data && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {data.getMarkerById.title}
            </h2>
            <div className="text-right">
              <h6>{data.getMarkerById.user.username}</h6>
              <p>{formatDate(data.getMarkerById.createdAt)}</p>
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
            {Auth.loggedIn() && (
              <>
                {Auth.getProfile().data._id === data.getMarkerById.user._id && (
                  <button
                    type="button"
                    className="btn btn-primary w-1/2"
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default DisplayBody;
