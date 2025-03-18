import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { FcGoogle } from "react-icons/fc";
import axios from 'axios'
import { ModeToggle } from '../../mode-toggle';
import { useTheme } from '@/useTheme';

const Header = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  
    const [openDialog, setOpenDialog] = useState(false);

    const [openDrawer, setOpenDrawer] = useState(false);

    const login = useGoogleLogin({
      onSuccess: codeResponse => getUserProfile(codeResponse),
      onError: error => console.log(error)
    })
  
    const getUserProfile = (tokenInfo) => {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${ tokenInfo?.access_token }`, {
        headers: {
          Authorization: `Bearer ${ tokenInfo?.access_token }`,
          Accept: 'Application/json'
        }
      }).then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      })
    }

    const theme = useTheme();

    const logoSrc = theme === "dark" ? "/darklogo.png" : "/lightlogo.png";

  return (
    <div className='p-3 shadow-sm flex items-center justify-between px-5'>
        <div className='flex gap-2 items-center'>
            <img className='h-10 w-full' src={ logoSrc } alt="" />
            {/* <p className='text-2xl font-bold'>Tripia</p> */}
        </div>
        <div>
          {
            user ?
            <div>
              <div className='hidden md:flex items-center gap-5'>
                <a href="/create-trip">
                  <Button className='rounded-full cursor-pointer' variant='outline'>+ Create Trip</Button>
                </a>
                <a href="/my-trips">
                  <Button className='rounded-full cursor-pointer' variant='outline'>View Trips</Button>
                </a>
                <Popover className='cursor-pointer'>
                  <PopoverTrigger>
                    <img className='h-[35px] w-[35px] rounded-full object-cover cursor-pointer' src={ `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ user?.picture }`)}` } alt="" />
                  </PopoverTrigger>
                    <PopoverContent>
                        <h2 className='cursor-pointer' onClick={ () => {
                          googleLogout();
                          localStorage.clear();
                          window.location.href = '/';
                        }}>
                          Logout
                        </h2>
                    </PopoverContent>
                </Popover>
                <ModeToggle />
              </div> 
              <div className='md:hidden'>
                <div className='flex gap-5 items-center'>
                  <ModeToggle />
                  <Drawer>
                    <DrawerTrigger>
                      <RxHamburgerMenu onClick={ () => setOpenDrawer(true) } />
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <div className='flex items-center justify-between py-10'>
                        <a href="/create-trip">
                          <Button className='rounded-full cursor-pointer' variant='outline'>+ Create Trip</Button>
                        </a>
                        <a href="/my-trips">
                          <Button className='rounded-full cursor-pointer' variant='outline'>View Trips</Button>
                        </a>
                        <Popover className='cursor-pointer'>
                          <PopoverTrigger>
                            <img className='h-[35px] w-[35px] rounded-full object-cover cursor-pointer' src={ `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ user?.picture }`)}` } alt="" />
                          </PopoverTrigger>
                            <PopoverContent>
                                <h2 onClick={ () => {
                                  googleLogout();
                                  localStorage.clear();
                                  window.location.href = '/';
                                }}>
                                  Logout
                                </h2>
                            </PopoverContent>
                        </Popover>
                        </div>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </div>

              </div>
            </div>
            :
            <Button onClick={ () => setOpenDialog(true) }>Sign In</Button>
          }
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
                      <img src='/logo.svg' alt="logo" />
                      <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
                      <p>Sign In to the app with Google Authentication securely</p>
                      <Button 
                        onClick={ login }
                        variant='outline' 
                        className='w-full text-black border-black mt-5 cursor-pointer hover:bg-black hover:text-white flex gap-4 items-center'
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

export default Header
