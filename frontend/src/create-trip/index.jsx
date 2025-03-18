import React, { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '../constants/options';
import toast from "react-hot-toast";
import { chatSession } from '../service/AIModal';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../service/firebaseConfig.jsx'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/useTheme';

const CreateTrip = () => {

  const theme = useTheme();
  
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const login = useGoogleLogin({
    onSuccess: codeResponse => getUserProfile(codeResponse),
    onError: error => console.log(error)
  })

  const onGenerateTrip = async () => {
    let toastId;
  
    try {
      const user = localStorage.getItem('user');

    if(!user) {
      setOpenDialog(true);
      return
    }

    if (formData?.NoOfDays > 5) {
      toast.error('No of days should be less than 5');
      return;
    } else if (!formData?.location) {
      toast.error('Please select location');
      return;
    } else if (!formData?.NoOfDays) {
      toast.error('Please select No of Days');
      return;
    } else if (!formData?.budget) {
      toast.error('Please select budget');
      return;
    } else if (!formData?.traveler) {
      toast.error('Please select traveller');
      return;
    } 
  
      setLoading(true);
      toastId = toast.loading("Generating your trip... Please Wait");
  
    const FINAL_PROMPT = AI_PROMPT
    .replace('{location}', formData?.location?.label)
    .replace('{totalDays}', formData?.NoOfDays)
    .replace('{traveler}', formData?.traveler)
    .replace('{budget}', formData?.budget)
    .replace('{totalDays}', formData?.NoOfDays);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
  
      setLoading(false);
      toast.dismiss(toastId);
      toast.success("Trip Generated Successfully!");
  
      SaveAiTrip(result?.response?.text());

    } catch (error) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error("Failed to Generate, Try Again");
    }
  };
  
  const SaveAiTrip = async (TripData) => {
  
    try {
      setLoading(true);

    const docId = Date.now().toString();

    const user = JSON.parse(localStorage.getItem('user'));

    await setDoc(doc(db, "AI Trips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });

    setLoading(false);

    navigate('/view-trip/' + docId)
    } catch (error) {
      setLoading(false);
      toast.error("Failed to Save, Try Again");
    }
  };
  
  const getUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${ tokenInfo?.access_token }`, {
      headers: {
        Authorization: `Bearer ${ tokenInfo?.access_token }`,
        Accept: 'Application/json'
      }
    }).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data));
      setOpenDialog(false);
      onGenerateTrip();
    })
  }

  const logoSrc = theme === "dark" ? "/darklogo.png" : "/lightlogo.png";

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences</p>
    
      <div className='mt-20 flex flex-col gap-10'>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is the Destination of your choice</h2>
          <GooglePlacesAutocomplete
            apiKey={ import.meta.env.VITE_GOOGLE_PLACE_API_KEY }
            selectProps={{
              place,
              onChange: (v) => {
               setPlace(v);
                handleInputChange('location', v)
              },
              styles: {
                control: (provided) => ({
                  ...provided,
                  backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
                  color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#000000",
                  borderColor: document.documentElement.classList.contains("dark") ? "#4b5563" : "#d1d5db",
                  borderRadius: "0.375rem",
                }),
                input: (provided) => ({
                  ...provided,
                  color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#000000",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#000000",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
                  color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#000000",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? document.documentElement.classList.contains("dark") ? "#4b5563" : "#e5e7eb"
                    : document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
                  color: state.isFocused
                    ? document.documentElement.classList.contains("dark") ? "#e5e7eb" : "#000000"
                    : document.documentElement.classList.contains("dark") ? "#f9fafb" : "#000000",
                  cursor: "pointer",
                }),
              },
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip</h2>
          <Input placeholder={ 'Ex.3' } type='number' onChange={ (e) => handleInputChange('NoOfDays', e.target.value)} />
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>

        <div className='grid grid-cols-3 gap-5 mt-5'>
          {
            SelectBudgetOptions.map((item, index) => (
              <div key={ index } onClick={ () => handleInputChange('budget', item.title )} className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${ formData?.budget == item.title && 'shadow-lg border-black'}`}>
                <h2 className='text-4xl'>{ item.icon }</h2>
                <h2 className='font-bold text-lg'>{ item.title }</h2>
                <h2 className='text-sm text-gray-500'>{ item.desc }</h2>
              </div>
            ))
          }
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>

        <div className='grid grid-cols-3 gap-5 mt-5'>
          {
            SelectTravelesList.map((item, index) => (
              <div key={ index }  onClick={ () => handleInputChange('traveler', item.people )} className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.traveler == item.people && 'shadow-lg border-black'}`}> 
                <h2 className='text-4xl'>{ item.icon }</h2>
                <h2 className='font-bold text-lg'>{ item.title }</h2>
                <h2 className='text-sm text-gray-500'>{ item.desc }</h2>
              </div>
            ))
          }
        </div>
      </div>
      <div className='my-10 flex justify-end'>
      
      <Button disabled = { loading } className='cursor-pointer' onClick={ onGenerateTrip }>
          {
            loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
          }
        </Button>
      </div>

      <Dialog open={ openDialog }>
        <DialogContent>
          <DialogHeader>
            <button 
              onClick={() => setOpenDialog(false)} 
              className="absolute top-3 right-5 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>
            <DialogDescription>
              <img className='h-6 w-20' src={ logoSrc } alt="logo" />
              <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
              <p>Sign In to the app with Google Authentication securely</p>
              <Button 
                onClick={ login }
                className='w-full mt-5 cursor-pointer flex gap-4 items-center'
              >
                <FcGoogle className='h-7 w-7' />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default CreateTrip
