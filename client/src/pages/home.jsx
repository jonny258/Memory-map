import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Marker from "../components/marker";
import "../assets/css/home.css";
import Popup from "../components/popup";
import Modal from "../components/modal";

class Memory {
  constructor(title, description, lngLat) {
    (this.title = title),
      (this.description = description),
      (this.lngLat = lngLat);
  }
}

function Home() {
  const mapStyles = {
    width: "100vw",
    height: "500px",
    position: "absolute",
    top: "0",
  };

  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLngLat, setActiveLngLat] = useState([])
  const [memoryArr, setMemoryArr] = useState([])

  useEffect(() => {
    // This Use effect makes it so the map loads on start
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiam9ubm1hbiIsImEiOiJjbGppeTh3cncwNDJyM2VubzBmbWY4dW5iIn0.q1fX0L5lbw6RlMZYhz8lhw";

    const map = new mapboxgl.Map({
      //this makes the map
      container: "map",
      style: "mapbox://styles/jonnman/cljiybkez001801r99ioccx42",
      center: [-111.88, 40.67],
      zoom: 10,
    });

    // This is the click event that adds the marker to my page
    map.on("click", (event) => {
      const popup = new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>");
      popup.on("open", () => {
        popup.addClassName("popup-non-visable");
        setActiveLngLat(popup.getLngLat())
        //I need this to filter properly
        console.log(memoryArr[0].lngLat.lat.toString())
        console.log(popup.getLngLat().lat.toFixed(14).toString())
        const matchedMemory = memoryArr.filter(mem => {
          return mem.lngLat.lat.toString() === popup.getLngLat().lat.toFixed(14).toString()
        })
        console.log(matchedMemory)
        openModal()
        console.log("test");
      });
      if (
        document.getElementById("memory-button").innerText ===
        "Click to View Memories"
      ) {
        const { lng, lat } = event.lngLat;
        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      } else {
        // console.log(event);
      }
    });

    //     Approach #1: Adding markers inside a map
    // Using symbol layer
    // map.on('click', (event) => {
    //   if (document.getElementById("memory-button").innerText === "Click to View Memories") {
    //     const { lng, lat } = event.lngLat;
    //     const markerElement = document.createElement('div');
    //     markerElement.className = 'marker';

    //     const marker = new mapboxgl.Marker(markerElement)
    //       .setLngLat([lng, lat])
    //       .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
    //       .addTo(map);

    //     setMarkers((prevMarkers) => [...prevMarkers, marker]);
    //   } else {
    //     // console.log(event);
    //   }
    // });

    //I dont know why I need this
    return () => {
      map.remove();
    };
  }, []);

  //This switches the inner text of the button
  const addMemoriesButtonHandler = (event) => {
    if (event.target.innerText === "Click to Add Memories") {
      event.target.innerText = "Click to View Memories";
    } else {
      event.target.innerText = "Click to Add Memories";
    }
  };

  //This will be how you search for a new location
  const searchButtonHandler = (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput");
    console.log(searchInput);
    console.log(searchInput.value);
  };

  //to open and close the modal
  const openModal = () => {
    console.log('open modal')
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log('close modal')
    setModalOpen(false);
  };

  const handleBackgroundClick = (event) => {
    console.log('handleBackground clicks')
    if (event.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  };

  return (
    <>
      <div id="map" style={mapStyles}></div>
      {/* This marker container is what holds all the markers */}
      <div id="marker-container">
        {markers.map((marker, index) => (
          <Marker key={index} marker={marker} />
        ))}
      </div>
      {/* This is the nav bar below */}
      <nav className="navbar navbar-dark bg-dark memory-controlls">
        <a className="navbar-brand">Navbar</a>
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          id="memory-button"
          onClick={() => addMemoriesButtonHandler(event)}
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
            onClick={() => searchButtonHandler(event)}
          >
            Search
          </button>
        </form>
      </nav>
      {modalOpen && <Modal
        activeLngLat={activeLngLat}
        isOpen={modalOpen}
        handleBackgroundClick={handleBackgroundClick}
        closeModal={closeModal}
        memoryArr={memoryArr}
        setMemoryArr={setMemoryArr}
      />}
      
    </>
  );
}

export default Home;
