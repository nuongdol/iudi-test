import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../images/logoApp.png'

import config from '../../configs/Configs.json'
import Navbar from './Navbar'
import { getProfile } from '../shared/getProfile'
import { Auth } from '../shared/Auth'

const { AVATAR_DEFAULT_MALE } = config

const Header3 = (props) => {
 const { userName } = new Auth()
 const [userInfo, setUserInfo] = useState(null)

 const styles = {
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: props?.isDark ? 'black' : 'transparent',
  transition: '.3s ease-in-out',
 }

 useEffect(() => {
  const fetchProfile = async () => {
   const res = await getProfile(userName)
   setUserInfo(res)
  }

  fetchProfile()
 }, [])

 const headerRef = useRef()
 useLayoutEffect(() => {
  props?.onGetHeight(headerRef.current.offsetHeight)
 }, [])

 return (
  <div
   ref={headerRef}
   id='header3'
   className='left-0 right-0 z-10 flex items-center justify-between text-white border-b border-solid border-b-white'
   style={styles}
  >
   <div className='flex items-center gap-2'>
    <Link
     to={`/profile/${userName}`}
     className='w-20 h-20 overflow-hidden m-[15px] rounded-[50%]'
    >
     <img
      src={AVATAR_DEFAULT_MALE || userInfo?.avatarLink}
      alt='avatar'
      className='w-full h-full'
     />
    </Link>

    <h3 className='capitalize'>{userName}</h3>
   </div>

   <div>
    <img src={Logo} alt='logo' />
   </div>

   <Navbar />
  </div>
 )
}
export default Header3
