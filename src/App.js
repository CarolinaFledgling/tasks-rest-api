
import React, { useState, useEffect } from 'react';
import './App.css';




function App() {
  const [valueInput, setValueInput] = useState("")
  const [dataCountriesnowApi, setDataCountriesnowApi] = useState([])
  const [error, setError] = useState(false)
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const [capital, setCapital] = useState("")
  const [weatherInfo, setWeatherInfo] = useState([])
  const [randomCountriesFromAPI, setRandomCountriesFromAPI] = useState([])

  const handleChangeInput = (e) => {
    setValueInput(e.target.value)

  }

  const getCapital = () => {
    fetch('https://countriesnow.space/api/v0.1/countries/capital')
      .then((res) => {
        if (!res.ok) {
          setStatus(true)
        }
        return res.json()
      })
      .then((data) => {

        return setDataCountriesnowApi(data)
      })
  }

  const getWeather = (providedCapital) => {
    console.log('getWeather', { providedCapital });
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${providedCapital}&appid=${process.env.REACT_APP_NOT_WEATHERAPI}`)
      .then((res) => {
        if (!res.ok) {
          setStatus(true)
        }
        return res.json()
      })
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
    getCapital()
  }, [])

  console.log("Data from first API", { dataDetailsList: dataCountriesnowApi.data })


  useEffect(() => {
    if (capital) {
      getWeather(capital)
    }
  }, [capital]);


  const handleSubmitForm = (e) => {
    e.preventDefault()

    if (!valueInput) {
      setError(true)
      return;
    } else {
      setError(false)
    }




    const dataApi = dataCountriesnowApi?.data
    //Find the value of the first element
    const foundCountry = dataApi?.find((item) => {
      const countryFromApi = item.name
      console.log(countryFromApi)
      if (valueInput.toLowerCase() === countryFromApi.toLowerCase()) {
        return true;
      }
      return false;
    })

    console.log('find capital', foundCountry?.capital)

    setCapital(foundCountry?.capital);
  }


  // Random 

  function getMultipleRandom(arr, num) {
    // we use spread syntax to do shadow copy of origian arr, because sort method mutate the origian arr

    //The Math.random function returns a float from 0 to 1, so we picked a number in the middle (0.5) from which we subtract the result from Math.random.
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
  }

  const handleRandomTenCities = (e) => {
    e.preventDefault()


    // to pratice to have a one random country
    
    // const existingCountriesLength = dataCountriesnowApi?.data.length;
    // const randomNumer = Math.random();
    // const randomCountries = randomNumer * (existingCountriesLength - 1)
    // const winnerPositionInArray = Math.round(randomCountries);
    // const randomCountry = dataCountriesnowApi?.data[winnerPositionInArray];
    // console.log(randomCountry)

    const random10Country = getMultipleRandom(dataCountriesnowApi?.data, 10)

    console.log(random10Country)

    setRandomCountriesFromAPI(random10Country)

  }
  return (
    <div className="App">
      <div>
        <form>
          <p>Check the weather of  {valueInput}</p>
          <div>
            <label>Enter Country </label>
            <input value={valueInput} onChange={handleChangeInput} />
          </div>
          <button onClick={handleSubmitForm}>Show Capital and Weather info</button>
          <button onClick={handleRandomTenCities}>Random</button>
          {capital && <p>{capital}</p>}
          {weatherInfo && <p>{weatherInfo}</p>}

          {error && <p>Please write the name of country </p>}
          {status && <p>Somthing went wrong with API Call </p>}


          <h3>10 random capital</h3>
          {randomCountriesFromAPI.map((item, index) => {
            return (
              <ul key={`country ${index}`}>
                <li>{index + 1}. {item.capital}</li>
              </ul>
            )
          })}
        </form>
      </div>
    </div >
  );
}

export default App;
