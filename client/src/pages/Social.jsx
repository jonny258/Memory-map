import React, { useEffect, useState, useRef } from "react";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "../components/Map";
import "../assets/css/social.css";
//I can change the styles
import "@splidejs/react-splide/css";
import SocialDiaplayModal from "../components/SocialDiaplayModal";
import Loading from "./loading";

function Social({ userState, setUserState, fetchRequest }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5500';

  const [activeMarker, setActiveMarker] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [displayUser, setDisplayUser] = useState("");
  const [markersInViewUsers, setMarkersInViewUsers] = useState(null);
  const [markersInView, setMarkersInView] = useState(null);
  const [isloggedIn, setIsloggedIn] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const splideMemoryRef = useRef();
  const splideUsersRef = useRef();
  const allUserDataRef = useRef("");
  const mapRef = useRef("");
  const parIndexRef = useRef(null);
  //const [allUserMarkerData, setAllUserMarkerData] = useState([])

  const markerClickHandler = (parIndex, index) => {
    console.log(index);
    console.log(parIndex);
    //setActiveUserMarkerIndex([parIndex, index]);
    console.log(allUserDataRef.current[parIndex].markers[index]);
    setActiveMarker(allUserDataRef.current[parIndex].markers[index]);
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
    if (parIndexRef.current || parIndexRef.current === 0) {
      console.log("Map move action has ended -- SINGLE");
      console.log(parIndexRef.current);

      const bounds = mapRef.current.getBounds();

      const markersInViewCurrent = allUserDataRef.current[
        parIndexRef.current
      ].markers.filter((marker) => bounds.contains([marker.lng, marker.lat]));
      console.log(markersInViewCurrent);
      console.log(markersInViewCurrent.length);
      setMarkersInView(markersInViewCurrent);
      setMarkersInViewUsers(null);
    } else {
      console.log("Map move action has ended -- MANY");
      console.log(allUserDataRef.current);
      console.log(parIndexRef.current);
      const arrOfArrMarkers = [];

      const bounds = mapRef.current.getBounds();

      allUserDataRef.current.forEach((user) => {
        const markersInViewCurrent = user.markers.filter((marker) =>
          bounds.contains([marker.lng, marker.lat])
        );
        arrOfArrMarkers.push(markersInViewCurrent);
        // console.log(markersInViewCurrent);
        // console.log(markersInViewCurrent.length)
        // setMarkersInView(markersInViewCurrent);
      });
      // console.log(arrOfArrMarkers);
      // console.log(arrOfArrMarkers.length);

      setMarkersInViewUsers(arrOfArrMarkers);
      setMarkersInView(null);
    }
  };

  const removeAllMarkers = () => {
    // Remove all markers from the map
    markers.forEach((marker) => marker.remove());

    // Clear the markers state
    setMarkers([]);
  };

  const addOneMarker = (user, parIndex, point, index) => {
    const map = mapRef.current;
    const popup = new mapboxgl.Popup({ closeButton: false });

    popup.on("open", (event) => {
      if (point.image) {
        popup.setHTML(
          `<img src='${point.image}' style="width:200px;height:auto;"/>`
        ); // adjust style as needed
      } else {
        popup.setHTML(`<h1 style="color:black;">${point.title}</h1>`); // adjust style as needed
      }
    });

    const marker = new mapboxgl.Marker({
      color: user.color,
    })
      .setLngLat([point.lng, point.lat])
      .setPopup(popup)
      .addTo(map);
    // Add the hover functionality here:
    marker.getElement().addEventListener("mouseenter", () => popup.addTo(map));
    marker.getElement().addEventListener("mouseleave", () => popup.remove());
    marker
      .getElement()
      .addEventListener("click", () => markerClickHandler(parIndex, index));

    setMarkers((prev) => [...prev, marker]);
  };

  const addMarkersToMap = (allUserData) => {
    // const markers = [];
    // console.log(map);
    // console.log(allUserData);

    allUserData.forEach((user, parIndex) => {
      user.markers.forEach((point, index) => {
        addOneMarker(user, parIndex, point, index);
      });
    });
  };

  const mapClickHandler = async (event) => {
    console.log(event);
  };

  const mapLoadHandler = async (event) => {
    try {
      console.log(userState);
      mapRef.current = event.target;
      const allUsersUrl = `${API_BASE_URL}/api/user/`;
      const allUserData = await fetchRequest("GET", allUsersUrl);
      allUserDataRef.current = allUserData;
      addMarkersToMap(allUserData);
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

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await fetchRequest(
          "GET",
          `${API_BASE_URL}/api/session`
        );
        if (sessionData[0]) {
          console.log("user is logged in");
          setIsloggedIn(true);
          //This gets the logged in user
          // const userUrl = `http://localhost:5500/api/user/${sessionData[0].currentUser._id}`;
          // const userData = await fetchRequest("GET", userUrl);
        } else {
          setIsloggedIn(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSession();
  });

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

  const userButtonHandler = (user, parIndex) => {
    if (user.markers[0]) {
      const camera = {
        center: [user.markers[0].lng, user.markers[0].lat],
        zoom: 7,
      };
      parIndexRef.current = parIndex;
      mapFly(camera);
      removeAllMarkers();
      user.markers.forEach((point, index) => {
        console.log(point);
        addOneMarker(user, parIndex, point, index);
      });
      setDisplayUser(user);
      setShowUsers(false);
    } else {
      alert("User has 0 memories");
    }
  };

  const goNext = (splideRef) => {
    if (splideRef) {
      splideRef.splide.go(">");
    }
  };

  const goPrev = (splideRef) => {
    if (splideRef) {
      splideRef.splide.go("<");
    }
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
    addMarkersToMap(allUserDataRef.current);
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

  const isDarkColor = (hexColor) => {
    // Remove the # symbol from the hex color code
    const hex = hexColor.replace("#", "");

    // Convert the hex color code to RGB values
    const red = parseInt(hex.substr(0, 2), 16);
    const green = parseInt(hex.substr(2, 2), 16);
    const blue = parseInt(hex.substr(4, 2), 16);

    // Calculate the relative luminance using the sRGB color space formula
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

    // Return true if the luminance is below a certain threshold, indicating a dark color
    return luminance < 0.5;
  };

  const calculateFontSize = (name, baseSize) => {
    let minSize = 12; // Do not go below 12px for readability

    // Decrease font size by 1px for each additional character over 10
    let adjustedSize = baseSize - Math.max(0, name.length - 10);

    // Do not go below the minimum size
    adjustedSize = Math.max(minSize, adjustedSize);

    return adjustedSize;
  };

  const logoutButtonHandler = async () => {
    try {
      navigate("/");
      const sessionUrl = `${API_BASE_URL}/api/session`;
      const deleteSession = await fetchRequest("DELETE", sessionUrl);
      console.log(deleteSession);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="map-container"
        id="map-container-custom"
        style={{
          width: 'calc(80vw - 17px)',
          height: "70vh",
          boxSizing: "border-box",
        }}
      >
        <div className="page-nav">
          <button
            className="btn btn-outline-warning"
            id="left-button"
            onClick={logoutButtonHandler}
          >
            {isloggedIn ? "Log Out" : "Sign up"}
          </button>
          {isloggedIn && (
            <button
              className="btn btn-outline-info"
              onClick={() => navigate("/home")}
            >
              Home
            </button>
          )}

          {/* <button
            className="btn btn-outline-success"
            onClick={() => setProfileModalOpen(true)}
          >
            Profile
          </button> */}
        </div>
        <Map
          center={[-111.88, 40.67]}
          mapClickHandler={mapClickHandler}
          mapLoadHandler={mapLoadHandler}
        />
      </div>
      <div
        className="section-container"
        style={{ width: "100vw", marginTop: "70vh" }}
      >
        <section>
          {showUsers ? (
            <>
              <h2>View users memories</h2>
              <div
                className="splide-wrapper-profile"
                style={{
                  border: `5px solid black`,
                }}
              >
                <button
                  id="custom-btn"
                  //   className={
                  //     displayUser.markers.length < 2 ? "display-none" : ""
                  //   }
                  onClick={() => goPrev(splideUsersRef.current)}
                >
                  <p>Prev</p>
                </button>
                <Splide
                  ref={splideUsersRef}
                  hasTrack={false}
                  options={{
                    rewind: true,
                    gap: "1rem",
                    perPage: 4,
                    perMove: 1,
                    arrows: false,
                  }}
                  aria-label="My Favorite Images"
                >
                  <SplideTrack>
                    {allUserDataRef.current.map((user, index) => {
                      return (
                        <SplideSlide key={index}>
                          <div className="card users-card">
                            <img src={user.pfp} className="card-img-top" />
                            <div className="card-body d-flex">
                              <div className="col-6 d-flex justify-content-center align-items-center border-right border-bottom light-border">
                                <h1
                                  className="card-title text-center"
                                  style={{
                                    fontSize: `${calculateFontSize(
                                      user.name,
                                      30
                                    )}px`,
                                  }}
                                >
                                  {user.name}
                                </h1>
                              </div>
                              <div className="col-6 d-flex justify-content-center align-items-center border-bottom light-border">
                                <h5 className="card-text text-center">
                                  Memories: {user.markers.length}
                                </h5>
                              </div>
                            </div>

                            <div className="view-mem-button">
                              <div className="view-mem-button">
                                <button
                                  // className={`btn view-mem-button ${
                                  //   isDarkColor(user.color) ? "white-text" : ""
                                  // }`}
                                  style={{ backgroundColor: user.color }}
                                  onClick={() => userButtonHandler(user, index)}
                                >
                                  <h5>View memories</h5>
                                </button>
                              </div>
                            </div>
                          </div>
                        </SplideSlide>
                      );
                    })}
                  </SplideTrack>
                  {/* <div className="splide__arrows">
                    <button
                      //   className="splide__arrow splide__arrow--prev"
                      className="splide__arrow splide__arrow--prev"
                      id="custom-btn"
                      onClick={() => goPrev(splideUsersRef.current)}
                    >
                      Prev
                    </button>
                    <button
                      className="splide__arrow splide__arrow--next"
                      onClick={() => goNext(splideUsersRef.currnet)}
                    >
                      Next
                    </button>
                  </div> */}
                </Splide>
                <button
                  id="custom-btn"
                  onClick={() => goNext(splideUsersRef.current)}
                >
                  <p>Next</p>
                </button>
              </div>
            </>
          ) : (
            <>
              {displayUser && (
                <section className="d-flex">
                  <div
                    className="card profile-card"
                    style={{ border: `5px solid ${displayUser.color}` }}
                  >
                    <img src={displayUser.pfp} className="card-img-top" />
                    <div className="card-body">
                      <h1
                        className="card-title"
                        style={{
                          fontSize: `${calculateFontSize(
                            displayUser.name,
                            50
                          )}px`,
                        }}
                      >
                        {displayUser.name}
                      </h1>
                      <h5 className="card-text">
                        Memories: {displayUser.markers.length}
                      </h5>
                    </div>
                  </div>
                  <div
                    className="splide-wrapper-mem"
                    style={{
                      border: `5px solid ${displayUser.color}`,
                    }}
                  >
                    {displayUser.markers.length > 2 && (
                      <button
                        id="custom-btn"
                        //   className={
                        //     displayUser.markers.length < 2 ? "display-none" : ""
                        //   }
                        onClick={() => goPrev(splideMemoryRef.current)}
                      >
                        <p>Prev</p>
                      </button>
                    )}

                    <Splide
                      ref={splideMemoryRef}
                      hasTrack={false}
                      options={{
                        rewind: true,
                        gap: "1rem",
                        perPage: 2,
                        perMove: 1,
                        arrows: false,
                      }}
                      aria-label="My Favorite Images"
                      // style={{
                      //   // height: "90%",
                      //   // flex: 1, // Let it grow to take available space
                      //   // width: displayUser ? "10vw" : '50px', // Minus the combined width of both buttons
                      // }}
                    >
                      <SplideTrack
                      // style={{
                      //   height: "100%",
                      // }}
                      >
                        {displayUser.markers.map((point, index) => {
                          return (
                            <SplideSlide
                              key={index}
                              //   style={{
                              //     width: "0vw",
                              //     height: '100%',
                              //     margin: "5px",
                              //   }}
                            >
                              <div
                                className="card splide-card"
                                style={{
                                  height: "100%",
                                }}
                              >
                                {point.image && (
                                  <img
                                    src={point.image}
                                    className="card-img-top"
                                  />
                                )}
                                <div className="card-body d-flex">
                                  <div className="col-6 d-flex justify-content-center align-items-center border-right border-bottom">
                                    <h2
                                      className={
                                        point.image
                                          ? "card-title text-center "
                                          : "card-title text-center big-font"
                                      }
                                    >
                                      {point.title}
                                    </h2>
                                  </div>
                                  <div className="col-6 d-flex justify-content-center align-items-center border-bottom">
                                    <p
                                      className={
                                        point.image
                                          ? "card-text text-center"
                                          : "card-text text-center medium-font"
                                      }
                                    >
                                      {point.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="view-mem-button">
                                  <button
                                    // className={`btn view-mem-button ${
                                    //   isDarkColor(displayUser.color)
                                    //     ? "white-text"
                                    //     : ""
                                    // }`}
                                    onClick={() =>
                                      viewMemoryButtonHandler(point)
                                    }
                                    style={{
                                      backgroundColor: displayUser.color,
                                    }}
                                  >
                                    <h5>View Memory</h5>
                                  </button>
                                </div>
                              </div>
                            </SplideSlide>
                          );
                        })}
                      </SplideTrack>
                    </Splide>
                    {/* This logic doesn't really work */}
                    {displayUser.markers.length > 2 && (
                      <button
                        id="custom-btn"
                        onClick={() => goNext(splideMemoryRef.current)}
                      >
                        <p>Next</p>
                      </button>
                    )}
                  </div>
                  <div className="view-all-btn">
                    <button
                      className="btn "
                      style={{
                        border: `5px solid ${displayUser.color}`,
                      }}
                      onClick={() => viewAllButtonHandler()}
                    >
                      <h2>View All</h2>
                    </button>
                  </div>
                </section>
              )}
            </>
          )}
        </section>
      </div>
      {activeMarker && (
        <SocialDiaplayModal
          setActiveMarker={setActiveMarker}
          activeMarker={activeMarker}
        />
      )}
      <div className="sidebar">
        {markersInView && (
          <>
            <ul className="list-group markers-in-map">
              {markersInView.map((point, index) => {
                return (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      border: `3px solid ${displayUser.color}`,
                    }}
                  >
                    <h6>{point.title}</h6>
                    <div className="btn-div">
                      <button
                        className="btn btn-info"
                        onClick={() => viewPointInMapHandler(point)}
                      >
                        View
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {markersInViewUsers && (
          <>
            <ul className="list-group markers-in-map">
              {markersInViewUsers.map((userMarkers, parIndex) => {
                return (
                  <div key={parIndex}>
                    {userMarkers.map((point, index) => {
                      return (
                        <li
                          key={`${parIndex}-${index}`}
                          className="list-group-item d-flex justify-content-between align-items-center"
                          style={{
                            border: `3px solid ${allUserDataRef.current[parIndex].color}`,
                          }}
                        >
                          <h6>{point.title}</h6>
                          <div className="btn-div">
                            <button
                              className="btn btn-info"
                              onClick={() => viewPointInMapHandler(point)}
                            >
                              View
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>

    // <>
    // <div className="map-container" id="map-container-custom">
    //   <Map
    //     style={{
    //       width: "80vw",
    //     }}
    //     center={[-111.88, 40.67]}
    //     mapClickHandler={mapClickHandler}
    //     mapLoadHandler={mapLoadHandler}
    //   />
    //   <section>
    //     <h2>View users memories</h2>
    //     {showUsers && (
    //       <Splide
    //         options={{
    //           rewind: true,
    //           gap: "1rem",
    //           perPage: 4, // Adjust the number of items per page as desired
    //           perMove: 1, // Adjust the number of items to move per slide as desired
    //         }}
    //         aria-label="My Favorite Images"
    //       >
    //         {allUserDataRef.current.map((user, index) => {
    //           return (
    //             <SplideSlide key={index}>
    //               <div className="card">
    //                 <img
    //                   src="https://upcdn.io/FW25bUs/image/uploads/2023/07/10/529233723_05b1348453_b-5NE5.jpg.crop?w=600&h=600&fit=max&q=70"
    //                   className="card-img-top"
    //                 />
    //                 <div className="card-body">
    //                   <h5 className="card-title">{user.name}</h5>
    //                   <p className="card-text">
    //                     Memories: {user.markers.length}
    //                   </p>
    //                   <button
    //                     className="btn"
    //                     style={{ backgroundColor: user.color }}
    //                     onClick={() => {
    //                       console.log(user);
    //                     }}
    //                   >
    //                     View memories
    //                   </button>
    //                 </div>
    //               </div>
    //             </SplideSlide>
    //           );
    //         })}
    //       </Splide>
    //     )}
    //   </section>

    //   {activeMarker && (
    //     <SocialDiaplayModal
    //       setActiveMarker={setActiveMarker}
    //       activeMarker={activeMarker}
    //     />
    //   )}
    // </div>
    //       <div className="sidebar">
    //       <h2>Sidebar</h2>
    //       <p>This is the sidebar content.</p>
    //     </div>
    //     </>
  );
}

export default Social;

//Add in loading
//The background in the sidebar is weird
//It would be cool to randomize the sidebar cards
//Get the map to be true 80vw
