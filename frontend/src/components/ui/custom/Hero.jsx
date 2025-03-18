import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col items-center mx-10 md:mx-56 gap-9'>
      <h1 className='font-extrabold text-[40px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover your Next Adventure with AI:</span> Personalized Iteneraries at your Fingertip</h1>
        <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraies tailored to your intrests and budget.</p>
        <Link to='/create-trip'>
            <Button className='cursor-pointer mb-10'>Get started for Free</Button>
        </Link>
    </div>
  )
}

export default Hero
