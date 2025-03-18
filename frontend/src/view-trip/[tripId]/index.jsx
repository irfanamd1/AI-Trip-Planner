import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore"; 
import { db } from '../../service/firebaseConfig.jsx'
import InfoSec from '../components/InfoSec.jsx';
import Hotels from '../components/Hotels.jsx';
import Places from '../components/Places.jsx';
import Footer from '../components/Footer.jsx';
import toast from 'react-hot-toast';

const ViewTrip = () => {

    const { tripId } = useParams();

    const [trip, setTrip] = useState([]);

    const getTripData = async () => {
      const docRef = doc(db, "AI Trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast.error("No trip Found");
      }
    }

    useEffect(() => {
        tripId&&getTripData();
    }, [tripId])

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Info Section */}
      <InfoSec trip={ trip } />

      {/* Hotel Section */}
      <Hotels trip={ trip } />

      {/* Places Section */}
      <Places trip={ trip } />

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

export default ViewTrip;
