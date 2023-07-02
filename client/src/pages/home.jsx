import React, { useEffect, useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/home.css";
import Modal from "../components/modal";

function Home() {
  //Unchanging constiant variables
  const mapStyles = {
    width: "100vw",
    height: "500px",
    position: "absolute",
    top: "0",
  };

  //Function wide changing variables
  let activeLngLat;

  //All of my usestate
  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [memoryArr, setMemoryArr] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [markerObject, setMarkerObject] = useState({});
  const [modalData, setModalData] = useState([]);

  const makeMarker = (mapObject, newMemory) => {
    //This is what make the new marker, it is called in modal.jsx but ran here
    const { lng, lat } = newMemory.lngLat; //Destrucures the lat and lng that were assigned to it
    const marker = new mapboxgl.Marker() //This makes the new marker
      .setLngLat([lng, lat]) //This positions the new marker
      .setPopup(mapObject.popup) //This gives it the pop up
      .addTo(mapObject.map); //This adds it to the map

    marker._element.slot = JSON.stringify(newMemory); //The new memory has the data like title and description that I need so I save it to the element on every marker
    setMarkers((prevMarkers) => [...prevMarkers, marker]); //Adds the new marker to the marker array
  };

  //These are simple functions local to home
  const openModal = () => {
    //Opens the modal
    console.log("open modal");
    setModalOpen(true);
  };

  const closeModal = () => {
    //Closes the modal
    console.log("close modal");
    setModalOpen(false);
  };

  const addMemoriesButtonHandler = (event) => {
    //switches the text on the modal
    if (event.target.innerText === "Click to Add Memories") {
      event.target.innerText = "Click to View Memories";
    } else {
      event.target.innerText = "Click to Add Memories";
    }
  };

  const searchButtonHandler = (event) => {
    //Will do something with the search in the future
    event.preventDefault();
    const searchInput = document.getElementById("searchInput");
    console.log(searchInput);
    console.log(searchInput.value);
  };

  const handleBackgroundClick = (event) => {
    //This doesn't work right now but this is how to modal background will work
    console.log("handleBackground clicks");
    if (event.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  };

  //This useRef is used to store the handler function that will persist across multiple re renders or react
  //I am storing this function in a handler so that I can call it outside of the useEffect but I can still get the most recent Markers cards
  const popUpOpenHandlerRef = useRef(null);

  useEffect(() => {
    //This useEffect runs everytime there is an update to the markers useState
    const handler = (popup) => {
      //The pop up being passed here is from the popup that was clicked
      const selectedMarker = markers.filter((mark) => {
        //This filters through the markers array
        return Math.abs(popup._lngLat.lat - mark._lngLat.lat) < 0.000001; //Returns an array of all the markers that meet the same latitude to with in 1/100000
      });
      const lastMatchedMarker = selectedMarker.pop(); //Because this is an array I get the last element using pop
      setModalData(JSON.parse(lastMatchedMarker._element.slot)); //Set the model data as the selected items slot value
      setIsEdit(false); //Sets what page the modal will be on
      openModal(); //Opens the modal
    };

    popUpOpenHandlerRef.current = handler; // Assign the handler function to the ref
  }, [markers]); //This is what makes it run every time the markers state updates

  const handleMapClick = (event) => {
    //This function runs on every single click to the mouse
    const map = mapRef.current; //Assigns map to the reference value
    const popup = new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"); //makes a new popup the html will never actually be seen

    popup.on("open", () => {
      popup.addClassName("popup-non-visable"); //assigns the modal a class that makes it not visable
      //This code updates the marker object, so that if you edit the memory then you will still have the correct values like lngLat
      activeLngLat = event.lngLat;
      setMarkerObject({
        event: event,
        popup: popup,
        map: map,
        lngLat: activeLngLat,
      });
      //VIEW MODE
      if (
        //This is verification that makes sure you are in the view mode, and makes sure that the pop up function has been assigned to a function
        document.getElementById("memory-button").innerText ===
          "Click to Add Memories" &&
        typeof popUpOpenHandlerRef.current === "function"
      ) {
        popUpOpenHandlerRef.current(popup); //runs the popup function that is in the useEffect and it gets the correct marker array
      }
    });

    //CREATE MODE
    if (
      //checks to see if you are in make a new one mode
      document.getElementById("memory-button").innerText ===
      "Click to View Memories"
    ) {
      setModalData([""]); //clears the modalData so that there isn't anything in the text boxes when you load in
      setIsEdit(true); //Sets the page that the modal will be on
      activeLngLat = event.lngLat; //sets the activeLngLat so that it will be correct
      openModal(); //opens the modal
      setMarkerObject({
        //sets all the right data so that a new marker can be made
        event: event,
        popup: popup,
        map: map,
        lngLat: activeLngLat,
      });
    }
  };

  const mapRef = useRef(null); //defines the map as a blank use ref

  useEffect(() => {
    //This useEffect runs once on start
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw"; //my map token, kind of like an API key

    const map = new mapboxgl.Map({
      //This makes the map
      container: "map",
      style: "mapbox://styles/jonnman/cljiybkez001801r99ioccx42", //Map styles
      center: [-111.88, 40.67], //Centers at salt lake city
      zoom: 10,
    });

    mapRef.current = map; //Assigns useRef to the map

    return () => {
      //I don't really know why I need this
      map.remove();
    };
  }, []);

  useEffect(() => {
    //This makes the map event handlers seperate from the creation of the map, this is also so that I can get the most recent data
    if (mapRef.current) {
      //this is for error handling
      const map = mapRef.current; //assigns the map so that it can get event handlers placed on it
      map.on("click", handleMapClick); //makes the handleMapClick work
      return () => {
        map.off("click", handleMapClick); //removes the handle map click so that there isn't duplicate code
      };
    }
  }, [handleMapClick]);

  //This is the HTML that is returned to the user
  return (
    <>
    {/* The map */}
      <div id="map" style={mapStyles}></div> 
      {/* The container that holds all the markers and renders them with a map*/}
      {markers.length > 0 && (
        <div id="marker-container">
          {markers.map((marker, index) => (
            <div key={index} className="marker"></div>
          ))}
        </div>
      )}

      {/* This is the nav bar below */}
      <nav className="navbar navbar-dark bg-dark memory-controlls">
        <a className="navbar-brand">Navbar</a>
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          id="memory-button"
          onClick={(event) => addMemoriesButtonHandler(event)}
        >
          Click to Add Memories
        </button>
        <form className="form-inline d-flex">
          <input
            id="searchInput"
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          ></input>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={(event) => searchButtonHandler(event)}
          >
            Search
          </button>
        </form>
      </nav>
      {modalOpen && (
        // This renders the modal and passes a ton of props that can be used in it
        <Modal
          setModalData={setModalData}
          modalData={modalData}
          mapObject={markerObject}
          makeMarker={makeMarker}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          activeLngLat={activeLngLat}
          isOpen={modalOpen}
          handleBackgroundClick={handleBackgroundClick}
          closeModal={closeModal}
          memoryArr={memoryArr}
          setMemoryArr={setMemoryArr}
        />
      )}
    </>
  );
}

export default Home;
