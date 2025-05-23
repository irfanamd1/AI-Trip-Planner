import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../service/firebaseConfig.jsx";
import { query, collection, where, getDocs } from "firebase/firestore";
import UserTripCard from "./components/UserTripCard.jsx";

const MyTrips = () => {
  const navigate = useNavigate();

  const [userTrips, setUserTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const getUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    const q = query(
      collection(db, "AI Trips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
      setUserTrips((prev) => [...prev, doc.data()]);
    });
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  useEffect(() => {
    if (userTrips?.length === 0) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setLoading(false);
    }
  }, [userTrips]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {userTrips?.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCard trip={trip} key={index} />
          ))
        ) : loading ? (
            [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-[180px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))
        ) : (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            <p>No Trips Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
