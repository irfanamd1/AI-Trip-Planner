import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

const Hotels = ({ trip }) => {
  return (
    <div>
      <h2 className='text-xl font-bold mt-5'>Hotel Recommendation</h2>

      <div className='grid md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
        {
            trip?.tripData?.hotels?.map((hotel, index) => (
              <div key={ index } className='border p-3 rounded-md hover:scale-105 transition-all cursor-pointer'>
                <HotelCardItem hotel={ hotel } />
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default Hotels
