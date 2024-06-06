import React, { useEffect, useState } from 'react'
import { BiCurrentLocation, BiSearch } from 'react-icons/bi'
import classNames from 'classnames'

const Inputs = ({setQuery,setUnits}) => {
  const [city,setCity] = useState('')
  
  const handleSearchClick = ()=>{
    if(city !== '')
      setQuery({q:city})
  }

  const handleLocationClick = ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude} = position.coords
        setQuery({lat:latitude, lon:longitude})
      })
    }
  }

  const [isSelected,setIsSelected] = useState(false);

  return (
    <div className='flex flex-row justify-center my-6'>

        <div className='flex flex-row w-3/5 items-center justify-center space-x-4'>
            <input type="text" 
                   value={city}
                   onChange={(e)=>setCity(e.currentTarget.value)} 
                   onKeyPress={(e)=>{
                     if(e.key === 'Enter'){
                      handleSearchClick()
                     }
                   }}
                   placeholder='search by city...' 
                   className='text-gray-500 font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase'
            />
            
            <BiSearch  size={30}
                       onClick={handleSearchClick} 
                       className='cursor-pointer transition ease-out hover:scale-125'
            />
            <BiCurrentLocation 
                      size={30} 
                      onClick={handleLocationClick} 
                      className='cursor-pointer transition ease-out hover:scale-125'
            />
        </div>

        
        <div className='flex flex-row w-1/5 items-center justify-center'>
            <button 
                    onClick={()=>setUnits('metric')} 
                    className='text-2xl font-medium transition ease-out hover:scale-125'
            >
              °C
            </button>
            <p className='text-2xl font-medium mx-1'>|</p>
            <button 
                    onClick={()=>setUnits('imperial')} 
                    className='text-2xl font-medium transition ease-out hover:scale-125'
            >
              °F
            </button>
        </div>

        {/* switch */}

        <div onClick = {()=>setIsSelected(!isSelected)} className={classNames('flex w-20 h-10 bg-blue-800 m-10 rounded-full transition-all duration-500',{'bg-green-600':isSelected,})}>
          <span className={classNames('h-10 w-10 bg-white rounded-full transition-all duration-500',{'ml-10':isSelected,})}></span>
        </div>

    </div>
  )
}

export default Inputs