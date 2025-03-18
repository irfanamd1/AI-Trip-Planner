import React from 'react'
import PlaceCardItem from './PlaceCardItem'

const Places = ({ trip }) => {
  return (
    <div>
      <h2 className='font-bold text-lg mt-5'>Places to Visit</h2>

      <div>
        {
            trip?.tripData?.itinerary?.map((item, index) => (

                <div key={ index } className='mt-5'>
                    <h2 className='font-medium text-lg'>{ item.day }</h2>

                    <div className='grid md:grid-cols-2 gap-5'>
                        {
                            item?.activities.map((place, index) => (
                                <div className='my-3' key={ index }>
                                    <h2 className='font-medium text-sm text-orange-600'>{ place.bestTimeToVisit }</h2>
                                    <PlaceCardItem place={ place } />
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Places
