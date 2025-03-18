import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

const InfoSec = ({ trip }) => {

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

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
    <div>
      {imageSrc ? (
          <img className='h-[340px] w-full object-cover rounded-xl' src={imageSrc} alt={trip?.userSelection?.location?.label} />
        ) : (
          <img className='h-[340px] w-full object-cover rounded-xl' src='/placeholder.jpg' alt={trip?.userSelection?.location?.label} />
        )
      }
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl'>{ trip?.userSelection?.location?.label }</h2>

            <div className='grid grid-cols-[0.5fr_0.8fr] md:grid-cols-[0.5fr_0.8fr_1fr] gap-3 md:gap-5 items-center'>
                <h2 className='p-1 px-2 bg-gray-200 rounded-full text-gray-500'>📅 { trip?.userSelection?.NoOfDays == 1 ? `${ trip?.userSelection?.NoOfDays } Day` : `${ trip?.userSelection?.NoOfDays } Days` }</h2>
                <h2 className='p-1 px-2 bg-gray-200 rounded-full text-gray-500'>💰 Budget: { trip?.userSelection?.budget }</h2>
                <h2 className='p-1 px-2 bg-gray-200 rounded-full text-gray-500 col-span-2 md:col-span-1'>🥂 No. of Travelers: { trip?.userSelection?.traveler }</h2>
            </div>
        </div>
        {/* <Button className='cursor-pointer hidden md:block'><IoIosSend /></Button> */}
      </div>
    </div>
  )
}

export default InfoSec
