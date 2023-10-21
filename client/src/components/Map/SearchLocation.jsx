import React from 'react'

function SearchLocation({ mapFly}) {

  async function fetchData(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
    }
  }


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
          const searchData = await fetchData(searchUrl);
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

  return (
    <form className="flex items-center">
    <input
      className="btn border rounded-r-none text-white"
      type="search"
      placeholder="Enter a location"
    />
    <button
      className="btn btn-accent rounded-l-none"
      onClick={(event) => searchButtonHandler(event)}
    >
      Search
    </button>
  </form>
  )
}

export default SearchLocation