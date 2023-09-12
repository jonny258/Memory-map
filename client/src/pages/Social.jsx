import React, { useEffect, useState, useRef } from "react";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
//import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "../components/Social/Map";
// import "../assets/css/social.css";
//I can change the styles
import "@splidejs/react-splide/css";
//import SocialDiaplayModal from "../components/SocialDiaplayModal";
import Loading from "./loading";
import SplideWrapper from "../components/SplideWrapper";
import UserCard from "../components/Social/UserCard";
import MarkerCard from "../components/MarkerCard";
import MarkersInViewCard from "../components/Social/MarkersInViewCard";
import Nav from "../components/Social/Nav";
import DisplayModal from "../components/MarkerModal";
import User from "./UserModal";
import MapFooter from "../components/MapFooter";
import CreateMemoryModal from "../components/Home/CreateMemoryModal";
import UserSection from "../components/UserSection";
import MemorySection from "../components/MemorySection";
import {
  GET_ALL_MARKERS,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { markersInMapVar } from "../App";
import { useReactiveVar } from "@apollo/client";
import Auth from "../utils/auth";

function Social({ userState, setUserState, fetchRequest }) {
  const markersArr = useReactiveVar(markersInMapVar);

  const {
    loading: markerLoading,
    error: markerError,
    data: markerData,
  } = useQuery(GET_ALL_MARKERS);

  const [loadUser, { called, loading, data }] = useLazyQuery(GET_USER_BY_ID);

  useEffect(() => {
    console.log(markerData);
    console.log(markerError);
    // console.log(userData);
  }, [markerData]);

  const [activeMarker, setActiveMarker] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [displayUser, setDisplayUser] = useState("");
  const [markersInViewUsers, setMarkersInViewUsers] = useState(null);
  const [markersInView, setMarkersInView] = useState(null);
  const [isloggedIn, setIsloggedIn] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [displayMarkerId, setDisplayMarkerId] = useState("");

  const [memorySectionId, setMemorySectionId] = useState("");

  //BUTTON STATE STUFF

  const [buttonState, setButtonState] = useState(false);
  const buttonStateRef = useRef(buttonState);

  useEffect(() => {
    buttonStateRef.current = buttonState;
  }, [buttonState]);

  const mapClickHandler = async (event) => {
    if (buttonStateRef.current) {
      if(Auth.loggedIn()){

        coordinatesRef.current = [event.lngLat.lat, event.lngLat.lng];
        setShowCreateModal(true);
      }else{
        alert("Sign into make a memory")
      }
    }
  };

  //BUTTON STATE STUFF

  const coordinatesRef = useRef();
  // const allUserDataRef = useRef("");
  const mapRef = useRef("");
  const parIndexRef = useRef(null);
  //const [allUserMarkerData, setAllUserMarkerData] = useState([])

  const markerClickHandler = (markerId) => {
    //console.log(markerId);
    if(!buttonStateRef.current){
      setShowDisplayModal(true);
      setDisplayMarkerId(markerId);
    }
  };

  //This could be used to shuffle the arrays, but I cant dig down
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const mapMoveHandler = () => {
    console.log(markersInMapVar());

    const bounds = mapRef.current.getBounds();

    const markersInViewCurrent = markersInMapVar().filter((marker) =>
      bounds.contains([marker.lng, marker.lat])
    );
    setMarkersInView(markersInViewCurrent);

    // if (parIndexRef.current || parIndexRef.current === 0) {
    //   console.log("Map move action has ended -- SINGLE");
    //   console.log(parIndexRef.current);

    //   const bounds = mapRef.current.getBounds();

    //   const markersInViewCurrent = allUserDataRef.current[
    //     parIndexRef.current
    //   ].markers.filter((marker) => bounds.contains([marker.lng, marker.lat]));
    //   console.log(markersInViewCurrent);
    //   console.log(markersInViewCurrent.length);
    //   setMarkersInView(markersInViewCurrent);
    //   setMarkersInViewUsers(null);
    // } else {
    //   console.log("Map move action has ended -- MANY");
    //   console.log(allUserDataRef.current);
    //   console.log(parIndexRef.current);
    //   const arrOfArrMarkers = [];

    //   allUserDataRef.current.forEach((user) => {
    //     const markersInViewCurrent = user.markers.filter((marker) =>
    //       bounds.contains([marker.lng, marker.lat])
    //     );
    //     arrOfArrMarkers.push(markersInViewCurrent);
    //   });
    //   setMarkersInViewUsers(arrOfArrMarkers);
    //   setMarkersInView(null);
    // }
  };

  const removeAllMarkers = () => {
    // Remove all markers from the map
    console.log(markers);
    markers.forEach((marker) => marker.remove());

    // Clear the markers state
    setMarkers([]);
  };

  const addOneMarker = (marker, index) => {
    console.log(marker, index);
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

  // const addMarkersToMap = (allUserData) => {
  //   // const markers = [];
  //   // console.log(map);
  //   // console.log(allUserData);

  //   console.log(API_BASE_URL);
  //   console.log(allUserData);
  //   allUserData.forEach((user, parIndex) => {
  //     user.markers.forEach((point, index) => {
  //       addOneMarker(user, parIndex, point, index);
  //     });
  //   });
  // };
  useEffect(() => {
    if (mapRef.current && markerData && markersInMapVar()) {
      markersInMapVar().forEach((marker, index) => {
        addOneMarker(marker, index);
      });
    } else {
      console.log("one or more are not loaded");
    }
  }, [markersInMapVar()]);

  useEffect(() => {
    if (mapRef.current && markerData) {
      console.log("Setting markersInMapVar with:", markerData.getAllMarkers);
      markersInMapVar(markerData.getAllMarkers);
    }
  }, [mapRef.current, markerData]);

  const mapLoadHandler = async (event) => {
    try {
      console.log("test test");
      mapRef.current = event.target;
      // const allUsersUrl = `${API_BASE_URL}/api/user`;
      // const allUserData = await fetchRequest("GET", allUsersUrl);
      // allUserDataRef.current = allUserData;
      //addMarkersToMap();

      setShowUsers(true);
      setIsLoading(false);

      // Now, add the event listeners here.
      // mapRef.current.on("move", (event) => {
      //   console.log("Map is moving");
      //   console.log(event);
      //   // Here, you can add the function you want to be executed when the map is moving
      // });

      // mapRef.current.on("zoom", (event) => {
      //   console.log("Map zoom level has changed");
      //   console.log(event);
      //   // Here, you can add the function you want to be executed when the map zoom level changes
      // });

      // mapRef.current.on("zoomend", (event) => {
      //   console.log("Map zoom action has ended");
      //   console.log(event);
      //   // Here, you can add the function you want to be executed when the map zoom action has ended
      // });
      // // const allMarkers = allUserDataRef.current.map((user, index) => {
      // //   return user.markers
      // // })

      mapRef.current.on("moveend", (event) => {
        mapMoveHandler();
      });

      mapMoveHandler();
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const getSession = async () => {
  //     try {
  //       console.log("This ran");
  //       const sessionData = await fetchRequest(
  //         "GET",
  //         `${API_BASE_URL}/api/session`
  //       );
  //       // if(sessionData){
  //       //   console.log(sessionData[0])
  //       // }
  //       if (sessionData) {
  //         console.log("user is logged in");
  //         setIsloggedIn(true);
  //         //This gets the logged in user
  //         const userUrl = `${API_BASE_URL}/api/user/${sessionData[0].currentUser._id}`;
  //         const userData = await fetchRequest("GET", userUrl);
  //         console.log(userData);
  //       } else {
  //         setIsloggedIn(false);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getSession();
  // }, []);

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
    console.log(response.data.getUserById);

    // if (user.markers[0]) {
    const camera = {
      center: [
        response.data.getUserById.markers[0].lng,
        response.data.getUserById.markers[0].lat,
      ],
      zoom: 7,
    };
    console.log(camera);
    //   parIndexRef.current = parIndex;
    mapFly(camera);

    console.log(markersInMapVar());
    removeAllMarkers();
    markersInMapVar(response.data.getUserById.markers);
    setDisplayUser(true);
    console.log(userId);
    setMemorySectionId(userId);
    setShowUsers(false);
    // } else {
    //   alert("User has 0 memories");
    // }
  };

  const viewPointInMapHandler = (point) => {
    console.log(point);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      setActiveMarker(point);
    }, 5000);
    const camera = {
      center: [point.lng, point.lat],
      zoom: 16,
    };
    mapFly(camera);
  };

  const viewAllButtonHandler = () => {
    console.log("view button handler");
    parIndexRef.current = null;
    setShowUsers(true);
    removeAllMarkers();
    // addMarkersToMap(allUserDataRef.current);
    const camera = {
      center: [-111.88, 40.67],
      zoom: 9,
    };
    mapFly(camera);
  };

  const viewMemoryButtonHandler = (user) => {
    console.log(user);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      setActiveMarker(user);
    }, 5000);
    const camera = {
      center: [user.lng, user.lat],
      zoom: 16,
    };
    mapFly(camera);
  };

  // const isDarkColor = (hexColor) => {
  //   // Remove the # symbol from the hex color code
  //   const hex = hexColor.replace("#", "");

  //   // Convert the hex color code to RGB values
  //   const red = parseInt(hex.substr(0, 2), 16);
  //   const green = parseInt(hex.substr(2, 2), 16);
  //   const blue = parseInt(hex.substr(4, 2), 16);

  //   // Calculate the relative luminance using the sRGB color space formula
  //   const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  //   // Return true if the luminance is below a certain threshold, indicating a dark color
  //   return luminance < 0.5;
  // };

  // const calculateFontSize = (name, baseSize) => {
  //   let minSize = 12; // Do not go below 12px for readability

  //   // Decrease font size by 1px for each additional character over 10
  //   let adjustedSize = baseSize - Math.max(0, name.length - 10);

  //   // Do not go below the minimum size
  //   adjustedSize = Math.max(minSize, adjustedSize);

  //   return adjustedSize;
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
          <>
            {displayUser && (
              <MemorySection
                userId={memorySectionId}
                viewAllButtonHandler={viewAllButtonHandler}
              />
            )}
          </>
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
    </>
  );
}

export default Social;
