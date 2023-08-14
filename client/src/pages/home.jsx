import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/home.css";
import ParentModal from "../components/ParentModal";
import Loading from "./loading";
import ProfileModal from "../components/ProfileModal";
import PictureUploader from "../components/PictureUploader";
import Map from "../components/Map";

function Home({ userState, setUserState, fetchRequest }) {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5500';

  const navigate = useNavigate();
  //This will be my is loading
  const [isLoading, setIsLoading] = useState(false);
  const [pictureState, setPictureState] = useState("");
  const [markerArr, setMarkersArr] = useState(
    userState ? userState.markers : []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [map, setMap] = useState(null);

  const memoryButtonRef = useRef();
  const coordinatesRef = useRef([]);

  class MakeMarker {
    constructor(lat, lng, title, description, date, name, image) {
      (this.lat = lat),
        (this.lng = lng),
        (this.title = title),
        (this.description = description),
        (this.date = date),
        (this.name = name),
        (this.image = image);
    }
  }

  //MAP FUNCTIONS
  const mapClickHandler = (clickEvent) => {
    if (memoryButtonRef.current.innerText === "Currently CREATE Mode") {
      coordinatesRef.current = [clickEvent.lngLat.lat, clickEvent.lngLat.lng];
      setModalOpen(true);
    }
  };

  const mapLoadHandler = (event) => {
    setMap(event.target);
    console.log("map loaded");
  };

  //FUNCTIONS CALLED BY USEEFFECT
  const getSession = async () => {
    try {
      console.log(API_BASE_URL)
      const sessionData = await fetchRequest(
        "GET",
        `${API_BASE_URL}/api/session`
      );
      if (sessionData[0]) {
        console.log("user is logged in");
        const userUrl = `${API_BASE_URL}/api/user/${sessionData[0].currentUser._id}`;
        const userData = await fetchRequest("GET", userUrl);
        setUserState(userData);
        setMarkersArr(userData.markers);
      } else {
        console.log("user is not logged in");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMarkersToMap = (map) => {
    const markers = [];
    console.log(markerArr);
    markerArr.forEach((point, index) => {
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

      const markerClickHandler = () => {
        if (memoryButtonRef.current.innerText === "Currently VIEW Mode") {
          setIsEdit(false);
          setActiveModal(index);
        }
      };

      const marker = new mapboxgl.Marker({
        color: userState.color,
      })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(map);
      // Add the hover functionality here:
      marker
        .getElement()
        .addEventListener("mouseenter", () => popup.addTo(map));
      marker.getElement().addEventListener("mouseleave", () => popup.remove());
      marker.getElement().addEventListener("click", () => markerClickHandler());

      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  };

  //USEEFFECT
  useEffect(() => {
    console.log("THE APP RE-RENDERED");
    if (!userState) {
      getSession();
    } else {
      console.log("User is logged in");
      // console.log(markerArr)
      // console.log(userState.markers)
      if (!markerArr) {
        setMarkersArr(userState.markers);
      } else {
        setMarkersArr([...markerArr]);
      }
    }
  }, []);

  useEffect(() => {
    if (map) {
      console.log("adding markers to map");
      const removeMarkers = addMarkersToMap(map);
      return removeMarkers;
    } else {
      console.log("map not loaded");
    }
  }, [markerArr, map]);

  const mapFly = (camera) => {
    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      duration: 5000,
      easing: function (t) {
        return 1 - Math.pow(1 - t, 3);
      },
    });
  };

  //SPECIFIC FUNCTIONS
  const searchButtonHandler = async (event) => {
    try {
      event.preventDefault();
      const query = event.target.form[0].value;
      const accessToken =
        "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";
      const baseEndpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places";
      const searchUrl = `${baseEndpoint}/${encodeURIComponent(
        query
      )}.json?access_token=${accessToken}&limit=1`;
      const searchData = await fetchRequest("Get", searchUrl);
      if (searchData.features[0]) {
        let zoomAmount;
        const placeType = searchData.features[0].place_type[0];
        switch (placeType) {
          case "country":
            zoomAmount = 5;
            break;
          case "region":
            zoomAmount = 7;
            break;
          case "district":
            zoomAmount = 10;
            break;
          case "place":
            zoomAmount = 12;
            break;
          case "postcode":
            zoomAmount = 14;
            break;
          case "locality":
            zoomAmount = 12;
            break;
          case "neighborhood":
            zoomAmount = 14;
            break;
          case "address":
            zoomAmount = 16;
            break;
          case "poi":
            zoomAmount = 14;
            break;
          case "landmark":
            zoomAmount = 14;
            break;
          default:
            zoomAmount = 10;
            break;
        }

        const camera = {
          center: searchData.features[0].geometry.coordinates,
          zoom: zoomAmount,
        };
        mapFly(camera);
      } else {
        alert("The place you searched for doesn't exist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveMemoryHandler = async (event) => {
    try {
      event.preventDefault();
      const title = event.target.form[0].value;
      const description = event.target.form[2].value;
      if (title && description) {
        const currentDate = new Date();
        const formattedDate = `${
          currentDate.getMonth() + 1
        }/${currentDate.getDate()}`;

        const newMarker = new MakeMarker(
          coordinatesRef.current[0],
          coordinatesRef.current[1],
          title,
          description,
          formattedDate,
          userState.name,
          pictureState
        );

        const markerURL = `${API_BASE_URL}/api/user/marker/${userState._id}`;
        const postedNewMarker = await fetchRequest(
          "POST",
          markerURL,
          newMarker
        );
        console.log(postedNewMarker);

        setMarkersArr((prev) => [...prev, newMarker]);
        setModalOpen(false);
      } else {
        alert("Please fillout both fields");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteButtonHandler = async (index) => {
    try {
      let deleteIndex;
      deleteIndex = typeof index === "number" ? index : activeModal;
      const updatedMarkerArr = [...markerArr];
      updatedMarkerArr.splice(deleteIndex, 1);
      setMarkersArr(updatedMarkerArr);
      setActiveModal(-1);

      const deleteUrl = `${API_BASE_URL}/api/user/marker/${userState._id}`;
      const deletedMarker = await fetchRequest("DELETE", deleteUrl, {
        deleteIndex: deleteIndex,
      });
      console.log(deletedMarker);
    } catch (err) {
      console.error(err);
    }
  };

  const editAndViewCardHandler = (lng, lat, index, editStatus) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const showModal = () => {
      setIsEdit(editStatus);
      setActiveModal(index);
    };
    setTimeout(showModal, 5000);
    const camera = {
      center: [lng, lat],
      zoom: 16,
    };
    mapFly(camera);
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
      <div className="map-container">
        <div className="page-nav">
          <button
            className="btn btn-outline-warning"
            id="left-button"
            onClick={logoutButtonHandler}
          >
            Log Out
          </button>
          <button
            className="btn btn-outline-info"
            onClick={() => navigate("/social")}
          >
            Social
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => setProfileModalOpen(true)}
          >
            Profile
          </button>
        </div>
        <Map
          center={[-111.88, 40.67]}
          mapClickHandler={mapClickHandler}
          mapLoadHandler={mapLoadHandler}
        />
        <nav className="navbar navbar-dark bg-dark memory-controlls">
          <a className="navbar-brand">Memory Map</a>
          <button
            ref={memoryButtonRef}
            className="btn btn-outline-success my-2 my-sm-0"
            id="memory-button"
            onClick={(event) => {
              event.target.innerText === "Currently CREATE Mode"
                ? (event.target.innerText = "Currently VIEW Mode")
                : (event.target.innerText = "Currently CREATE Mode");
            }}
          >
            Currently VIEW Mode
          </button>
          <form className="form-inline d-flex search-box">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Enter a location"
            ></input>
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              onClick={(event) => searchButtonHandler(event)}
            >
              Search
            </button>
          </form>
        </nav>
        <div className="container">
          <h1>{userState ? userState.name : "Defaultname"}'s memories</h1>
          <div className="card">
            <ul className="list-group list-group-flush">
              {markerArr.map((point, index) => {
                return (
                  <li className="list-group-item" key={index}>
                    <div className="d-flex">
                      <div
                        className="col border d-flex justify-content-between col-text"
                        id="leftmost-card"
                      >
                        <h3>{point.title}</h3>
                        <div className="text-end">
                          <h6>{point.name ? point.name : "Default Name"}</h6>
                          <p>{point.date}</p>
                        </div>
                      </div>
                      <div className="col border col-text">
                        <p>{point.description}</p>
                      </div>
                      <div
                        className="col border d-flex flex-row align-items-start col-buttons"
                        id="rightmost-card"
                      >
                        <button
                          className="btn btn-outline-info w-100 h-100"
                          onClick={() =>
                            editAndViewCardHandler(
                              point.lng,
                              point.lat,
                              index,
                              false
                            )
                          }
                        >
                          View
                        </button>
                        <button
                          className="btn btn-outline-success w-100 h-100"
                          onClick={() =>
                            editAndViewCardHandler(
                              point.lng,
                              point.lat,
                              index,
                              true
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger w-100 h-100"
                          id="rightmost-card"
                          onClick={() => {
                            deleteButtonHandler(index);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {markerArr.map((point, index) => {
        const modalProps = {
          fetchRequest,
          pictureState,
          setPictureState,
          userState,
          deleteButtonHandler,
          isEdit,
          setIsEdit,
          markerArr,
          setMarkersArr,
          index,
          setActiveModal,
          key: index,
          title: point.title,
          description: point.description,
          date: point.date,
          name: point.name,
          imageSrc: point.image ? point.image : null,
        };

        return index === activeModal && <ParentModal {...modalProps} />;
      })}

      {profileModalOpen && (
        <ProfileModal
          getSession={getSession}
          setProfileModalOpen={setProfileModalOpen}
          user={userState}
          markerArr={markerArr}
          fetchRequest={fetchRequest}
        />
      )}
      {isLoading && <Loading />}
      {modalOpen && (
        <>
          <div className="modal-backdrop-custom fade show"></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            onClick={(event) => {
              event.target.className === "modal fade show" &&
                setModalOpen(false);
            }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content modal-sizing">
                <form>
                  <div className="modal-header">
                    <div className="input-group input-group-lg">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-lg"
                        >
                          Memory
                        </span>
                      </div>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="modal-body">
                    <PictureUploader
                      uploadText={"Upload an image..."}
                      pictureState={pictureState}
                      setPictureState={setPictureState}
                    />
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Description</span>
                      </div>
                      <textarea id="home-textArea" className="form-control" />
                    </div>
                  </div>
                  <div className="custom-modal-footer">
                    <button
                      id="left-button"
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModalOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      id="right-button"
                      type="submit"
                      className="btn btn-success"
                      onClick={(event) => saveMemoryHandler(event)}
                    >
                      Save Memory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
