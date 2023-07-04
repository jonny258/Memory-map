import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/home.css";
import ParentModal from "../components/ParentModal";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [memoryButtonMode, setMemoryButtonMode] = useState(false);
  const [activeModal, setActiveModal] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [userState, setUserState] = useState(null);
  // const [userState, setUserState] = useState(()=> {
  //   fetch('http://localhost:5500/api/session')
  //   .then((response) => response.json())
  //   .then((data) => {
  //     return data
  //   })
  // })
  const [mapStyles, setMapStyles] = useState(
    "mapbox://styles/jonnman/cljn80p85002l01rgdt63guar"
  );
  const [markerArr, setMarkersArr] = useState(() => [
    //Where I will fetch values
    {
      lat: 40.7608,
      lng: -111.891,
      title: "Salt Lake City",
      description: "This is Salt Lake City.",
      name: "Mary Jane",
      date: "6/29",
    },
    {
      lat: 40.6461,
      lng: -111.4979,
      title: "Park City",
      description: "This is Park City.",
      name: "Jack Lou",
      date: "5/29",
    },
    {
      lat: 40.2338,
      lng: -111.6585,
      title: "Provo",
      description: "This is Provo.",
      name: "Jonathan Christian",
      date: "3/8",
    },
    {
      lat: 41.223,
      lng: -111.9738,
      title: "Ogden",
      description: "This is Ogden.",
      name: "mikey",
      date: "8/1",
    },
  ]);

  const mapRef = useRef(null);
  const searchButtonRef = useRef();
  const memoryButtonRef = useRef();

  const modalMemoryDescriptionRef = useRef("");
  const modalMemoryTitleRef = useRef("");
  const coordinatesRef = useRef([]);

  class MakeMarker {
    constructor(lat, lng, title, description, date, name) {
      (this.lat = lat),
        (this.lng = lng),
        (this.title = title),
        (this.description = description),
        (this.date = date),
        (this.name = name);
    }
  }

  const mapClickHandler = (clickEvent) => {
    if (memoryButtonRef.current.innerText === "Currently CREATE Mode") {
      console.log("Map has been clicked on CREATE mode");
      coordinatesRef.current = [clickEvent.lngLat.lat, clickEvent.lngLat.lng];
      setModalOpen(true);
    } else if (memoryButtonRef.current.innerText === "Currently VIEW Mode") {
      console.log("Map has been clicked on VIEW mode");
    } else {
      console.log("ERROR something went wrong");
      console.log(memoryButtonMode);
      console.log(memoryButtonRef);
    }
  };

  const mapLoadHandler = () => {};

  useEffect(() => {
    fetch("http://localhost:5500/api/session")
      .then((response) => response.json())
      .then((data) => {
        setUserState(data);
      })
      .catch((error) => {
        console.error("Error fetching user session:", error);
      });
  }, []);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";

    const map = new mapboxgl.Map({
      container: "map",
      style: mapStyles,
      center: [-111.88, 40.67],
      zoom: 10,
    });

    mapRef.current = map;

    map.on("click", (event) => {
      mapClickHandler(event);
    });

    map.on("load", () => {
      mapLoadHandler();
    });

    setMarkersArr([...markerArr]);

    return () => {
      map.remove();
      map.off("load");
      map.off("click");
    };
  }, [mapStyles]);

  useEffect(() => {
    const map = mapRef.current;
    const markers = [];

    markerArr.forEach((point, index) => {
      const popup = new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>");
      popup.on("open", (event) => {
        popup.addClassName("popup-non-visable");
        if (memoryButtonRef.current.innerText === "Currently VIEW Mode") {
          console.log("pop up was clicked");
          setIsEdit(false);
          setActiveModal(index);
        }
      });

      const marker = new mapboxgl.Marker({
        color: (userState ? userState[0].currentUser.color : '#FFFFFF'),
      })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(map);
      markers.push(marker);
    });4
    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [markerArr, userState]);

  const mapFly = (camera) => {
    const map = mapRef.current;

    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration: camera.duration,
      easing: function (t) {
        return 1 - Math.pow(1 - t, 3);
        // return t
        //return t * t
      },
    });
  };

  const searchButtonHandler = () => {
    const query = searchButtonRef.current.value;

    const accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";
    const baseEndpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places";
    const url = `${baseEndpoint}/${encodeURIComponent(
      query
    )}.json?access_token=${accessToken}&limit=1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.features[0]) {
          let zoomAmount;
          const placeType = data.features[0].place_type[0];
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
            center: data.features[0].geometry.coordinates,
            zoom: zoomAmount,
            pitch: 0,
            bearing: 0,
            duration: 5000,
          };
          mapFly(camera);
        } else {
          alert("The place you searched for doesn't exist");
        }
      })
      .catch((err) => console.error(err));
  };

  const saveMemoryHandler = () => {
    if (
      modalMemoryTitleRef.current.value &&
      modalMemoryDescriptionRef.current.value
    ) {
      //I need to input the name here
      const currentDate = new Date();
      const formattedDate = `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}`;

      console.log(coordinatesRef.current);
      const newMarker = new MakeMarker(
        coordinatesRef.current[0],
        coordinatesRef.current[1],
        modalMemoryTitleRef.current.value,
        modalMemoryDescriptionRef.current.value,
        formattedDate
      );
      console.log(newMarker);
      setMarkersArr((prev) => [...prev, newMarker]);
      setModalOpen(false);
    } else {
      alert("Please fillout both fields");
    }
  };

  const deleteButtonHandler = (index) => {
    if (typeof index === "number") {
      const updatedMarkerArr = [...markerArr];
      updatedMarkerArr.splice(index, 1);
      setMarkersArr(updatedMarkerArr);
      setActiveModal(-1);
    } else {
      const updatedMarkerArr = [...markerArr];
      updatedMarkerArr.splice(activeModal, 1);
      setMarkersArr(updatedMarkerArr);
      setActiveModal(-1);
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
      pitch: 0,
      bearing: 0,
      duration: 5000,
    };
    mapFly(camera);
  };

  const modalBackgroundHandler = (event) => {
    if (event.target.className === "modal fade show") {
      setModalOpen(false);
    }
  };

  return (
    <>
      <div className="map-container">
        <div className="map-styles-selector">
          <h3>Map Styles</h3>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-light"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn7z6j3001301ocf8xh52il"
                )
              }
            >
              Light
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn80p85002l01rgdt63guar"
                )
              }
            >
              Dark
            </button>
            <button
              type="button"
              className="btn btn-success"
              id="right-button"
              onClick={() =>
                setMapStyles(
                  "mapbox://styles/jonnman/cljn81k8o002f01r9ecuh6zxf"
                )
              }
            >
              Satellite
            </button>
          </div>
        </div>
        <div id="map"></div>
        {/* Edit and change nav below */}
        <nav className="navbar navbar-dark bg-dark memory-controlls">
          <a className="navbar-brand">Memory Map</a>
          <button
            ref={memoryButtonRef}
            className="btn btn-outline-success my-2 my-sm-0"
            id="memory-button"
            onClick={() => setMemoryButtonMode(!memoryButtonMode)}
          >
            {memoryButtonMode ? "Currently CREATE Mode" : "Currently VIEW Mode"}
          </button>
          <div className="form-inline d-flex search-box">
            <input
              ref={searchButtonRef}
              className="form-control mr-sm-2"
              type="search"
              placeholder="Enter a location"
              aria-label="Search"
            ></input>
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              onClick={searchButtonHandler}
            >
              Search
            </button>
          </div>
        </nav>
        <div className="container">
          <h1>{userState ? userState[0].currentUser.name : "Defaultname"}'s memories</h1>
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

        {markerArr.map((point, index) => {
          return (
            index === activeModal && (
              <ParentModal
                deleteButtonHandler={deleteButtonHandler}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                markerArr={markerArr}
                setMarkersArr={setMarkersArr}
                key={index}
                index={index}
                setActiveModal={setActiveModal}
                title={point.title}
                description={point.description}
                date={point.date}
                name={point.name}
              />
            )
          );
        })}
      </div>

      {modalOpen && (
        <>
          <div className="modal-backdrop-custom fade show"></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            onClick={modalBackgroundHandler}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content modal-sizing">
                <>
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
                      <input
                        type="text"
                        className="form-control"
                        ref={modalMemoryTitleRef}
                      />
                    </div>
                  </div>
                  <div className="modal-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Description</span>
                      </div>
                      <textarea
                        id="home-textArea"
                        className="form-control"
                        ref={modalMemoryDescriptionRef}
                      />
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
                      type="button"
                      className="btn btn-success"
                      onClick={saveMemoryHandler}
                    >
                      Save Memory
                    </button>
                  </div>
                </>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
