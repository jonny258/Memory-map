import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/home.css";
import ParentModal from "../components/ParentModal";
import Loading from "./loading";
import ProfileModal from "../components/ProfileModal";
import PictureUploader from "../components/PictureUploader";
import Map from "../components/Home/Map";
import Nav from "../components/Home/Nav";
import SplideWrapper from "../components/SplideWrapper";
import MarkerCard from "../components/MarkerCard";
import SearchLocation from "../components/Home/SearchLocation";
import CreateMemoryModal from "../components/Home/CreateMemoryModal";
import DisplayModal from "../components/DisplayModal";
import EditModal from "../components/EditModal";

function Home({ userState, setUserState, fetchRequest }) {
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5500";

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

  //MAP FUNCTIONS
  const mapClickHandler = (clickEvent) => {
    console.log(memoryButtonRef.current.innerText);
    if (memoryButtonRef.current.innerText === "CURRENTLY CREATE MODE") {
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
      console.log(API_BASE_URL);
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
        if (memoryButtonRef.current.innerText === "CURRENTLY VIEW MODE") {
          console.log("AAAAAAAAAAAAAAAAAAA");
          console.log(index);
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

  useEffect(() => {
    console.log("THE APP RE-RENDERED");
    if (!userState) {
      getSession();
    } else {
      console.log("User is logged in");

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

  //Move this local aswell

  //Make this local
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

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        <div className="h-3/5 relative">
          <Nav />

          <Map
            center={[-111.88, 40.67]}
            mapClickHandler={mapClickHandler}
            mapLoadHandler={mapLoadHandler}
          />
        </div>

        <nav className="bg-gray-900 flex items-center justify-between px-48">
          <a className="font-bold text-white">Memory Map</a>
          <button
            ref={memoryButtonRef}
            className="btn btn-primary w-1/3"
            id="memory-button"
            onClick={(event) => {
              console.log([event.target.innerText]);
              console.log(memoryButtonRef);
              event.target.innerText === "CURRENTLY CREATE MODE"
                ? (event.target.innerText = "CURRENTLY VIEW MODE")
                : (event.target.innerText = "CURRENTLY CREATE MODE");
            }}
          >
            CURRENTLY VIEW MODE
          </button>
          <SearchLocation fetchRequest={fetchRequest} mapFly={mapFly} />
        </nav>
        <div className="items-center justify-between px-48">
          <h1 className="text-3xl font-bold mb-4">
            {userState ? userState.name : "Defaultname"}'s memories
          </h1>
          <SplideWrapper>
            {markerArr.map((point, index) => (
              <MarkerCard
                key={index}
                point={point}
                index={index}
                deleteButtonHandler={deleteButtonHandler}
                editAndViewCardHandler={editAndViewCardHandler}
              />
            ))}
          </SplideWrapper>
          <div className="rounded-lg overflow-hidden shadow-md"></div>
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
        return (
          index === activeModal && (
            <DisplayModal
              handleClose={() => {
                setActiveModal(-1);
              }}
              {...modalProps}
            />
          )
        );
        //return index === activeModal && <ParentModal {...modalProps} />;
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
        <CreateMemoryModal
          fetchRequest={fetchRequest}
          setMarkersArr={setMarkersArr}
          userState={userState}
          coordinatesRef={coordinatesRef}
          handleClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export default Home;
