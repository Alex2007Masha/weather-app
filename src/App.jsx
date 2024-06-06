import React, { useEffect, useState } from 'react'
import TopButtons from './components/TopButtons'
import Inputs from './components/Inputs'
import TimeAndLocation from './components/TimeAndLocation'
import TempAndDetails from './components/TempAndDetails'
import Forecast from './components/Forecast'
import getWeatherData from './services/weatherService'
import getFormattedWeatherData from './services/weatherService'



const App = () => {
  
  const [query,setQuery] = useState({q:'minsk'})
  const [units,setUnits] = useState('metric')
  const [weather,setWeather] = useState(null)
  const [AppStyle, setAppStyle] = useState('from-cyan-600 to-blue-700')
  const [BackgroundStyle, setBackgroundStyle] = useState()

  const [theme,setTheme] = useState()



  const getWeather = async () =>{
    const data = await getFormattedWeatherData({...query,units}).then(data=>{
      setWeather(data);
    });
    console.log(data);
  }

  useEffect(()=>{getWeather()},[query,units])

  useEffect(() => {
    if(!weather)  {
      setAppStyle('from-cyan-600 to-blue-700');
      setBackgroundStyle('from-cyan-300 to-blue-800');
      return
    }
    const threshold = units === 'metric' ? 20 : 60;
    if (weather.temp <= threshold) {
      setAppStyle('from-cyan-600 to-blue-700');
      setBackgroundStyle('from-cyan-300 to-blue-800');
      return;
    }
    setAppStyle('from-yellow-600 to-orange-700');
    setBackgroundStyle('from-yellow-400 to-orange-800');
  }, [weather, units]);

  // useEffect(()=>{
  //   if(!isSelected)  {
  //     setAppStyle('from-cyan-600 to-blue-700');
  //     setBackgroundStyle('from-cyan-300 to-blue-800');
  //     return
  //   }
  //   setAppStyle('from-emerald-500 to-emerald-800');
  //   setBackgroundStyle('from-green-500 to-emerald-800');
  // },[isSelected]);

  return (
    <div className={`bg-gradient-to-br ${BackgroundStyle} p`}>
      <div className={`  mx-auto max-w-screen-lg mb-3 py-5 px-32 bg-gradient-to-br shadow-xl rounded-3xl shadow-black-300 ${AppStyle} text-white `}>
          <TopButtons setQuery={setQuery}/>
          <Inputs  setQuery={setQuery} setUnits={setUnits} />
          {/* setIsSelected={setIsSelected} */}
          {weather && (
            <>
            <TimeAndLocation weather={weather}/>
            <TempAndDetails weather={weather} units={units}/>
            <Forecast title='3 hour step forecast' data={weather.hourly}/>
            <Forecast title='daily forecast' data={weather.daily}/>
            </>
          )}     
      </div>
    </div>
  )
}

export default App