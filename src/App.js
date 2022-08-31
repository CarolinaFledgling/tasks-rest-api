
import React, { useState, useEffect } from 'react';
import './App.css';


// Links From APIs

const urlGeonames = 'https://secure.geonames.org/searchJSON?q='



function App() {
  const [country, setCauntry] = useState("")
  const [dataApi, setDataApi] = useState([])
  const [capital, setCapital] = useState("")
  const [weatherInfo, setWeatherInfo] = useState([])
  const [statusInfo, setStatus] = useState(false)


  const handleChangeInput = (e) => {
    console.log(e.target.value)
    setCauntry(e.target.value)
  }


  const getCapital = () => {

    fetch(`https://countriesnow.space/api/v0.1/countries/capital`)
      .then((response) => {
        if (!response.ok) {
          setStatus(true)
          throw Error(response.statusText);
        }
        return response.json();
      })


      .then((data) => {
        setDataApi(data)

      })
      .catch((err) => {
        console.log("error from Weather API", err)
      })
  }



  const getWeather = (providedCapital) => {
    console.log('getWeather', { providedCapital });
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${providedCapital}&appid=${process.env.REACT_APP_NOT_WEATHERAPI}`)
      .then((res) => res.json())
      .then((data) => {

        console.log('weatherDataApi details: ', { data, dataNeme: data.name, dataWeather: data.weather });
        const weatherDetails = data.weather.map((detail) => {
          return detail.main;
        })
        console.log('weatherDetails: ', weatherDetails);
        setWeatherInfo(weatherDetails);
        console.log(weatherDetails);

      })
      .catch((err) => {
        console.log("error", err)
      })
  }

  useEffect(() => {
    getCapital();
  }, [])


  useEffect(() => {
    if (capital) {
      getWeather(capital)
    }
  }, [capital]);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // console.log("dane z API", { dataApi }, dataApi.data)

    setStatus(false)

    const arrCountryandCites = dataApi.data
    console.log("dane z API", { arrCountryandCites })



    const foundCountry = arrCountryandCites.find((item) => {
      const capital = item.capital
      const countryApi = item.name
      // console.log("Country", countryApi, "Capital", capital)

      if (country.toLowerCase() === countryApi.toLowerCase()) {
        console.log("from if", capital)
        return true;
      }
      return false;
    })

    console.log('FoundCountry', foundCountry);

    setCapital(foundCountry.capital);

  }

  return (
    <div className="App">
      <div>
        <form>
          <p>Check the weather of the capital{country}</p>
          <div>
            <label>Enter Country</label>
            <input value={country} onChange={handleChangeInput} />
          </div>
          <button onClick={handleSubmitForm}>Show Capital of Country </button>
          <p>{capital} is {weatherInfo}</p>
          {statusInfo && <p>Somthing went wrong with API</p>}
        </form>
      </div>
    </div>
  );
}

export default App;
