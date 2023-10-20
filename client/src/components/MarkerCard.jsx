import React from "react";
import { SplideSlide } from "@splidejs/react-splide";
import { EDIT_MARKER, DELETE_MARKER } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { markersInMapVar } from "../App";
import { userDataVar } from "../main";

function MarkerCard({ point, index, isMyProfile, viewPointInMapHandler }) {
  const [
    deleteMarker,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_MARKER);

  const deleteHandler = async () => {
    try {
      const response = await deleteMarker({
        variables: {
          markerId: point._id,
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
    } catch (error) {
      console.error("Error deleting marker: ", error);
      // Handle the error appropriately in your application,
      // such as displaying an error message to the user
    }
  };

  return (
    //Fix the edit and view card handlers
    <SplideSlide>
      <div className="card card-compact w-72 bg-base-100 shadow-xl">
        <figure>
          <img src={point.media} />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-white">{point.title}</h2>
          <p className="text-white">{point.description}</p>

          <div className="justify-end flex flex-row items-center">
            <button
              className={
                isMyProfile
                  ? "btn btn-primary w-1/2 rounded-r-none" // Remove the right border radius
                  : "btn btn-primary w-full"
              }
              onClick={() => {
                viewPointInMapHandler(point);
              }}
            >
              View
            </button>
            {isMyProfile && (
              <button
                className="btn btn-error w-1/2 rounded-l-none" // Remove the left border radius
                onClick={deleteHandler}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </SplideSlide>
  );
}

export default MarkerCard;
