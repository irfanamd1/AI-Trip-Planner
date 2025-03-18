import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";

const HotelCardItem = ({ hotel }) => {

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel.hotelName,
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
    <Link
      to={"https://www.google.com/maps/search/?api=1&query=" + hotel?.hotelName + "," + hotel?.hotelAddress }
      target="_blank"
    >
      <div className="">
        {imageSrc ? (
            <img className="rounded-xl h-[180px] w-full object-cover" src={imageSrc} alt={hotel.hotelName} />
          ) : (
            <img className="rounded-xl h-[180px] w-full object-cover" src='/placeholder.jpg' alt={hotel.hotelName} />
          )
        }
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍 {hotel.hotelAddress}</h2>
          <h2 className="text-sm text-gray-500">💵 {hotel.price}</h2>
          <h2 className="text-sm text-gray-500">⭐ {hotel?.rating} ratings</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
