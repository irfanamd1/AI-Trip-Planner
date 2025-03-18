import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { Link } from 'react-router-dom';

const UserTripCard = ({ trip }) => {

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label,
      };

      const resp = await GetPlaceDetails(data);
      const photoName = resp.data.places[0].photos[3].name;
      const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);

      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(photoUrl)}`;

      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      setImageSrc(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }; 

  return (
    <Link to={'/view-trip/'+ trip.id}>
        <div className='hover:scale-105 transition-all hover:shadow-md border p-3 rounded-md'>
            {imageSrc ? (
                <img className='h-[180px] w-full object-cover rounded-xl' src={imageSrc} alt={trip?.userSelection?.location?.label} />
              ) : (
                <img className='h-[180px] w-full object-cover rounded-xl' src='/placeholder.jpg' alt={trip?.userSelection?.location?.label} />
              )
            }
            <div>
                <h2 className='font-bold text-lg mt-4'>{ trip?.userSelection?.location?.label }</h2>
                <h2 className='text-sm text-gray-500'>{ trip?.userSelection?.NoOfDays } Days trip with { trip?.userSelection?.traveler } on { trip?.userSelection?.budget } budget.</h2>
            </div>
        </div>
    </Link>
  )
}

export default UserTripCard
