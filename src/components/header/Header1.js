import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../images/logoApp.png'

import Navbar from './Navbar'

const Header1 = () => {
  return (
    <div className="hidden md: block lg:block xl:block 2xl:block">
      <div className="text-white pb-[100px]">
        <div className="fixed left-0 right-0 z-10 flex items-center justify-between text-white">
          <Link to="/" className="mr-4 py-1.5 px-3 font-medium">
            <img src={Logo} alt="Example" />
          </Link>
          <Navbar />
        </div>
      </div>
    </div>
  )
}
export default Header1
