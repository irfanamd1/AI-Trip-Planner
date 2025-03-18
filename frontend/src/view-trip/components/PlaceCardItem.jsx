import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";

const PlaceCardItem = ({ place }) => {
  
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: place.placeName,
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
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + ',' + place?.geoCoordinates?.latitude + ',' + place?.geoCoordinates?.longitude} target='_blank'>
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        {imageSrc ? (
          <img className='w-[130px] h-[130px] rounded-xl object-cover' src={imageSrc} alt={place.placeName} />
        ) : (
          <img className='w-[130px] h-[130px] rounded-xl object-cover' src='/placeholder.jpg' alt={place.placeName} />
        )}
        <div>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-400'>{place.placeDetails}</p>
          <h2 className='mt-2'>🕘 {place.timeTravel}</h2>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCardItem;
