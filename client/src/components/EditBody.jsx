import React, { useState, useRef, useEffect } from "react";
import PictureUploader from "./PictureUploader";
import { GET_MARKER_BY_ID } from "../GraphQL/Queries";
import { EDIT_MARKER, DELETE_MARKER } from "../GraphQL/Mutations";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

function EditModal({ markerId, handleClose, setShowEditModal }) {
  const {
    loading: markerLoading,
    error: markerError,
    data: markerData,
  } = useQuery(GET_MARKER_BY_ID, {
    variables: { markerId: markerId },
  });
  const [
    editMarker,
    { data: editData, loading: editLoading, error: editError },
  ] = useMutation(EDIT_MARKER);
  const [
    deleteMarker,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_MARKER);
  // useEffect(() => {
  //   if (data) {
  //     console.log(data.getMarkerById);
  //   }
  // }, [data]);

  const [pictureState, setPictureState] = useState("");

  const titleRef = useRef();
  const descriptionRef = useRef();

  const saveChangesHandler = async () => {
    try {
      const body = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        media: pictureState || markerData.getMarkerById.media,
      };
      console.log(body);

      const responce = await editMarker({
        variables: {
          markerId: markerId,
          input: body,
        },
      });
      console.log(responce);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  //This needs to delete with the markersInMapVar
  const deleteHandler = async () => {
    const response = await deleteMarker({
      variables: {
        markerId: markerId,
      }
    });
    console.log(response)
    handleClose()
  };

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
      {markerData && (
        <div>
          <div className="mb-4 relative pt-1">
            <div className="absolute top-0 right-0">
              <h2 className="text-right">
                {markerData.getMarkerById.user.username}
              </h2>

              <h2 className="text-right">
                {formatDate(markerData.getMarkerById.createdAt)}
              </h2>
            </div>
            <label className="label text-white mt-4">Memory</label>
            <input
              ref={titleRef}
              type="text"
              className="input input-bordered w-full text-white"
              defaultValue={markerData.getMarkerById.title}
            />
          </div>

          <div className="mb-4">
            <PictureUploader
              uploadText={"Change image..."}
              pictureState={pictureState}
              setPictureState={setPictureState}
            />
          </div>

          <div className="mb-4">
            <label className="label text-white">Description</label>
            <textarea
              ref={descriptionRef}
              id="home-textArea"
              className="textarea textarea-bordered w-full h-32 text-white"
              defaultValue={markerData.getMarkerById.description}
            />
          </div>

          <div className="flex justify-between w-full">
            <button type="button" className="btn w-1/3" onClick={handleClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-error w-1/3"
              onClick={deleteHandler}
            >
              Delete
            </button>
            <button
              type="submit"
              className="btn btn-primary w-1/3"
              onClick={saveChangesHandler}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EditModal;
