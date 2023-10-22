import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Map from "../components/Map/Map";
import MarkersInViewCard from "../components/MarkersInViewCard";
import Nav from "../components/Nav";
import DisplayModal from "../components/Modals/Marker/MarkerModal";
import MapFooter from "../components/Map/MapFooter";
import CreateMemoryModal from "../components/Modals/CreateMemoryModal";
import UserSection from "../components/Section/UserSection";
import MemorySection from "../components/Section/MemorySection";

import { GET_ALL_MARKERS, GET_USER_BY_ID } from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { markersInMapVar } from "../App";
import { useReactiveVar } from "@apollo/client";
import Auth from "../utils/auth";
import { userDataVar } from "../main";

function Social() {
  const markersArr = useReactiveVar(markersInMapVar);

  const {
    loading: markerLoading,
    error: markerError,
    data: markerData,
  } = useQuery(GET_ALL_MARKERS);

  const [loadUser, { called, loading, data }] = useLazyQuery(GET_USER_BY_ID);

  const [showUsers, setShowUsers] = useState(false);
  const [markers, setMarkers] = useState([]);
  // const [displayUser, setDisplayUser] = useState("");
  const [markersInView, setMarkersInView] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [displayMarkerId, setDisplayMarkerId] = useState("");
  const [memorySectionId, setMemorySectionId] = useState("");
  const [buttonState, setButtonState] = useState(false);

  const mapRef = useRef("");
  const coordinatesRef = useRef();
  const buttonStateRef = useRef(buttonState);

  const mapClickHandler = async (event) => {
    if (buttonStateRef.current) {
      if (Auth.loggedIn()) {
        coordinatesRef.current = [event.lngLat.lat, event.lngLat.lng];
        setShowCreateModal(true);
      } else {
        alert("Sign into make a memory");
      }
    }
  };

  const markerClickHandler = (markerId) => {
    if (!buttonStateRef.current) {
      setShowDisplayModal(true);
      setDisplayMarkerId(markerId);
    }
  };

  const mapMoveHandler = () => {
    let markers;
    if (markersInMapVar().getAllMarkers) {
      markers = markersInMapVar().getAllMarkers;
    } else {
      markers = markersInMapVar();
    }

    const bounds = mapRef.current.getBounds();

    const markersInViewCurrent = markers.filter((marker) =>
      bounds.contains([marker.lng, marker.lat])
    );
    setMarkersInView(markersInViewCurrent);
  };

  const removeAllMarkers = () => {
    // Remove all markers from the map
    markers.forEach((marker) => marker.remove());

    // Clear the markers state
    setMarkers([]);
  };

  const addOneMarker = (marker, index) => {
    const map = mapRef.current;
    const popup = new mapboxgl.Popup({ closeButton: false });

    popup.on("open", (event) => {
      popup.setHTML(
        `<img src='${marker.media}' style="width:200px;height:auto;"/>`
      );
    });

    const newMarker = new mapboxgl.Marker({
      color: marker.user.color,
    })
      .setLngLat([marker.lng, marker.lat])
      .setPopup(popup)
      .addTo(map);
    // Add the hover functionality here:
    newMarker
      .getElement()
      .addEventListener("mouseenter", () => popup.addTo(map));
    newMarker.getElement().addEventListener("mouseleave", () => popup.remove());
    newMarker
      .getElement()
      .addEventListener("click", () => markerClickHandler(marker._id));

    setMarkers((prev) => [...prev, newMarker]);
  };

  useEffect(() => {
    const setUserData = async (userId) => {
      const response = await loadUser({ variables: { userId: userId } });
      userDataVar(response.data.getUserById);
    };
    if (Auth.loggedIn()) {
      setUserData(Auth.getProfile().data._id);
    }
  }, []);

  useEffect(() => {
    buttonStateRef.current = buttonState;
  }, [buttonState]);

  useEffect(() => {
    if (mapRef.current && markerData && markersArr) {
      removeAllMarkers();
      if (markersArr.getAllMarkers) {
        markersArr.getAllMarkers.forEach((marker, index) => {
          addOneMarker(marker, index);
        });
      } else {
        markersArr.forEach((marker, index) => {
          addOneMarker(marker, index);
        });
      }
    } else {
      console.log("one or more are not loaded");
    }
  }, [markersArr]);

  useEffect(() => {
    if (mapRef.current && markerData) {
      console.log("Setting markersInMapVar with:", markerData.getAllMarkers);
      markersInMapVar(markerData.getAllMarkers);
      mapMoveHandler();
    }
  }, [mapRef.current, markerData]);

  const mapLoadHandler = async (event) => {
    try {
      mapRef.current = event.target;
      setShowUsers(true);
      mapRef.current.on("moveend", (event) => {
        mapMoveHandler();
      });
    } catch (err) {
      console.error(err);
    }
  };

  const mapFly = (camera) => {
    const map = mapRef.current;
    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      duration: 5000,
      easing: function (t) {
        return 1 - Math.pow(1 - t, 3);
      },
    });
  };

  const userButtonHandler = async (userId) => {
    const response = await loadUser({ variables: { userId: userId } });

    if (response.data.getUserById.markers[0]) {
      const camera = {
        center: [
          response.data.getUserById.markers[0].lng,
          response.data.getUserById.markers[0].lat,
        ],
        zoom: 7,
      };
      mapFly(camera);
      removeAllMarkers();
      markersInMapVar(response.data.getUserById.markers);
      // setDisplayUser(true);
      setMemorySectionId(userId);
      setShowUsers(false);
    } else {
      alert("User has 0 memories");
    }
  };

  const viewPointInMapHandler = (point) => {
    console.log(point);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      setShowDisplayModal(true);
      setDisplayMarkerId(point._id);
    }, 5000);
    const camera = {
      center: [point.lng, point.lat],
      zoom: 16,
    };
    mapFly(camera);
  };

  const viewAllButtonHandler = () => {
    console.log("view button handler");
    setShowUsers(true);
    removeAllMarkers();
    markersInMapVar(markerData);
    const camera = {
      center: [-111.88, 40.67],
      zoom: 9,
    };
    mapFly(camera);
  };

  // const viewMemoryButtonHandler = (user) => {
  //   console.log(user);
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });

  //   setTimeout(() => {
  //     setActiveMarker(user);
  //   }, 5000);
  //   const camera = {
  //     center: [user.lng, user.lat],
  //     zoom: 16,
  //   };
  //   mapFly(camera);
  // };

  return (
    <>
      <Nav initialState={Auth.loggedIn() ? false : true} />
      <Map
        center={[-111.88, 40.67]}
        mapClickHandler={mapClickHandler}
        mapLoadHandler={mapLoadHandler}
      />
      <div className="absolute top-0 right-0 w-1/5 h-[70vh] box-border overflow-y-auto bg-gray-500">
        <h1 className="sticky top-0 bg-gray-900 p-4 z-10 text-2xl font-bold rounded-bl">
          Memories in View
        </h1>
        {markersInView && (
          <ul>
            {markersInView.map((point, index) => {
              return (
                <MarkersInViewCard
                  key={index}
                  point={point}
                  viewPointInMapHandler={viewPointInMapHandler}
                />
              );
            })}
          </ul>
        )}
      </div>
      <MapFooter
        mapFly={mapFly}
        buttonState={buttonState}
        setButtonState={setButtonState}
      />
      <section>
        {showUsers ? (
          <UserSection userButtonHandler={userButtonHandler} />
        ) : (
          <MemorySection
            userId={memorySectionId}
            viewAllButtonHandler={viewAllButtonHandler}
            viewPointInMapHandler={viewPointInMapHandler}
          />
        )}
      </section>
      {showCreateModal && (
        <CreateMemoryModal
          coordinatesRef={coordinatesRef}
          handleClose={() => {
            setShowCreateModal(false);
          }}
        />
      )}

      {showDisplayModal && (
        <DisplayModal
          markerId={displayMarkerId}
          handleClose={() => setShowDisplayModal(false)}
        />
      )}
      <div className="mt-5 bottom-0 w-full bg-gray-800 p-4">
        <div className="text-center text-white">
          <a
            href="https://github.com/jonny258"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center space-x-2"
          >
            <i className="fab fa-github text-2xl"></i>
            <span>Jonny258</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Social;
