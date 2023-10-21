import React, { useState, useRef, useEffect } from "react";
import PictureUploader from "./PictureUploader";
import { GET_MARKER_BY_ID } from "../GraphQL/Queries";
import { EDIT_MARKER, DELETE_MARKER } from "../GraphQL/Mutations";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { markersInMapVar } from "../App";
import { userDataVar } from "../main";

function EditModal({ markerId, handleClose, setShowEditModal }) {
  console.log(markersInMapVar());
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

      const response = await editMarker({
        variables: {
          markerId: markerId,
          input: body,
        },
      });
      console.log(response);
      setShowEditModal(false);

      // Update markersInMapVar
      const currentMarkersInMap = markersInMapVar();

      const updatedMarkersInMap = currentMarkersInMap.map((marker) =>
        marker._id === response.data.editMarker._id
          ? response.data.editMarker
          : marker
      );
      markersInMapVar(updatedMarkersInMap);

      // Update userDataVar
      const currentUserData = userDataVar();

      const updatedUserDataMarkers = currentUserData.markers.map((marker) =>
        marker._id === response.data.editMarker._id
          ? response.data.editMarker
          : marker
      );
      // Using spread operator to update the entire user data along with updated markers
      userDataVar({ ...currentUserData, markers: updatedUserDataMarkers });
    } catch (err) {
      console.error(err);
      // Handle the error appropriately, such as showing an error message to the user
    }
  };

  const deleteHandler = async () => {
    try {
      const response = await deleteMarker({
        variables: {
          markerId: markerId,
        },
      });
      console.log(response.data.deleteMarker._id);

      // Update markersInMapVar
      const currentMarkersInMap = markersInMapVar();
      if (currentMarkersInMap) {
        const updatedMarkersInMap = currentMarkersInMap.filter(
          (marker) => marker._id !== response.data.deleteMarker._id
        );
        markersInMapVar(updatedMarkersInMap);
      }

      // Update userDataVar
      const currentUserData = userDataVar();
      if (currentUserData && currentUserData.markers) {
        const updatedUserDataMarkers = currentUserData.markers.filter(
          (marker) => marker._id !== response.data.deleteMarker._id
        );
        // Using spread operator to update the entire user data along with updated markers
        userDataVar({ ...currentUserData, markers: updatedUserDataMarkers });
      }

      handleClose();
    } catch (error) {
      console.error("Error deleting marker: ", error);
      // Handle the error appropriately in your application,
      // such as displaying an error message to the user
    }
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
