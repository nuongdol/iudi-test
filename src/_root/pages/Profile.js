import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AiOutlineHome, AiOutlineMail } from 'react-icons/ai'
import { FaRegUser } from 'react-icons/fa6'
import {
  MdOutlineDateRange,
  MdOutlineLocalPhone,
  MdOutlineWhereToVote,
} from 'react-icons/md'

import Header1 from '../../components/header/Header1'
import Footer from '../../components/shared/Footer'
import bg from '../../images/bg3.jpg'
import bgProfile from '../../images/profiles/bg-profile.png'

import { Auth } from '../../components/shared/Auth'
import FormChangePassword from '../../components/shared/FormChangePassword'
import configs from '../../configs/Configs.json'
import ArrowUp2 from '../../images/profiles/ArrowUp2.png'
import Chat from '../../images/profiles/Chat.png'
import Line6 from '../../images/profiles/Line6.png'

const { URL_BASE64 } = configs

function Profile() {
  const { userID, userName } = new Auth()
  const [profileData, setProfileData] = useState({})
  const [isModalOpenChangePass, setIsModalOpenChangePass] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewAllImage, setViewAllImage] = useState({})

  const { username } = useParams()

  const background = {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }

  const navigate = useNavigate()
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `https://api.iudi.xyz/api/profile/${username}`
        )
        setProfileData(response.data.Users[0])
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [username])


  const {
    avatarLink,
    FullName,
    Bio,
    Email,
    BirthDate,
    CurrentAdd,
    Phone,
    BirthPlace,
    UserID,
  } = profileData
  
  const paragraph = `Mình xin được tự giới thiệu. Mình tên là ${Bio}, một cá nhân đam mê với việc khám phá và học hỏi. Mình đã trải qua nhiều khía cạnh khác nhau của cuộc sống và có niềm đam mê mãnh liệt với việc chia sẻ kiến thức và trải nghiệm với mọi người.`
  

  const dataList = [
    {
      id: 1,
      name: FullName,
      icon: <FaRegUser />,
    },

    {
      id: 2,
      name: Phone,
      icon: <MdOutlineLocalPhone />,
    },

    {
      id: 3,
      name: Email,
      icon: <AiOutlineMail />,
    },

    {
      id: 4,
      name: BirthDate,
      icon: <MdOutlineDateRange />,
    },

    {
      id: 5,
      name: BirthPlace,
      icon: <MdOutlineWhereToVote />,
    },
    {
      id: 6,
      name: CurrentAdd,
      icon: <AiOutlineHome />,
    },
  ]

  const handleToggle =()=>{
    setIsExpanded(!isExpanded)
  }
  const displayText = isExpanded ? paragraph : paragraph.slice(0,150)

  
  useEffect(()=>{
    const getAllViewImage = async ()=>{
      try{
        const response = await axios.get(
          `https://api.iudi.xyz/api/profile/viewAllImage/${UserID}`
        )
        setViewAllImage(response.data.Photos[0])
      }catch(error){
        console.error('Error fetching profile data: ', error)
      }
    }
    getAllViewImage()

  },[UserID])

  const{
    PhotoID,
    PhotoURL,
    SetAsAvatar,
    UploadTime
  } = viewAllImage
 
  return (
    <>
      <div className='sm:hidden' style={background}>
        <Header1 />
        <div className='flex items-center justify-center mt-[100px]'>
          <div className='bg-white rounded-[30px] w-[550px] overflow-hidden border-2  border-[#4EC957]'>
            <div
              style={{
                background: `center/cover no-repeat  url(${bgProfile})`,
                height: '150px',
              }}
              className='w-full'
            ></div>

            <div className='mt-[-80px] z-[1]'>
              <img
                src={`${URL_BASE64}${avatarLink}`}
                alt='profile'
                className='mx-auto rounded-full h-[130px] w-[130px] object-cover  border-2 border-pink-100'
              />
            </div>

            <div className='px-[50px] pb-5'>
              <div className='text-center mt-5'>
                <h4 className='mx-auto font-inter leading-tight font-bold text-[40px] capitalize'>
                  {FullName}
                </h4>

                <p
                  className='mb-2 text-[25px] italic text-[#8E8E8E]'
                  style={{ overflowWrap: 'break-word' }}
                >
                  {Bio}
                </p>
              </div>

              <ul className='flex flex-col gap-4 mt-[30px]'>
                {dataList.map(({ id, name, icon }) => {
                  return (
                    <li key={id} className='flex gap-5 items-center'>
                      <div className='text-2xl'>{icon}</div>
                      <p className='text-xl'>{name}</p>
                    </li>
                  )
                })}
              </ul>

              <div className='flex justify-between gap-5 mb-5 mt-[50px]'>
                <div>
                  <button
                    className={`py-4 px-5 text-xl font-bold text-white bg-[#50C759] rounded-[20px] hover:bg-green-600 duration-200 ${username !== userName ? 'cursor-not-allowed opacity-70' : ''
                      }`}
                    onClick={() => username === userName && setIsModalOpenChangePass(true)}
                  >
                    Change Password
                  </button>
                </div>
                <div>
                  <button
                    className='py-4 text-xl px-5 font-bold text-white bg-[#50C759] rounded-[20px] hover:bg-green-600 duration-200'
                    onClick={() => {
                      username === userName
                        ? navigate('/personal')
                        : UserID &&
                        navigate(`/message/${UserID}`, {
                          state: {
                            userName: FullName,
                            isOnline: true,
                            userId: userID,
                            avatar: avatarLink,
                          },
                        })
                    }}
                  >
                    {username !== userName ? 'Nhắn tin' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FormChangePassword
          userId={userID}
          isOpen={isModalOpenChangePass}
          onClose={() => setIsModalOpenChangePass(false)}
        />
        <Footer />
      </div>

      <div className='sm:absolute inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.3)] md:hidden '>
        <div class="flex flex-col relative w-full h-screen justify-center items-center overflow-hidden">
          <div className=' absolute h-[40%] w-full top-0'>
            <img src={`${URL_BASE64}${avatarLink}`} className='relative h-full w-full' style={{ borderRadius: "0px 0px 39px 39px", }} alt='avatar' />
            <a href='/'><img src={ArrowUp2} alt='ArrowUp' className=' top-0 left-0 absolute mt-10 ' /></a>

          </div>
          <div className='absolute w-full bg-white top-[50%] -my-20 mx-4'>
            <div className='flex justify-between items-center mx-4'>
              <div>
                <p className='font-bold text-[28px]'>{FullName}</p>

                <p>{BirthPlace}</p>
              </div>
              <button className='w-[40px] h-[40px]' style={{ backgroundImage: `url(${Chat})`, backgroundSize: 'cover' }} onClick={() => {
                UserID &&
                  navigate(`/message/${UserID}`, {
                    state: {
                      userName: FullName,
                      isOnline: true,
                      userId: userID,
                      avatar: avatarLink,
                    },
                  })
              }}></button>
            </div>
            <img src={Line6} alt='' className='w-full' />
            <div className='mx-4'>
              <h1 class="font-bold">Giới thiệu</h1>
              <div style={{textAlign:"justify", textJustify:"inter-word"}}> 
                <p>{displayText}
                  {paragraph.length > 150 && (<span  className="font-bold text-[rgba(0,135,72,1)]" onClick={handleToggle}>{isExpanded ?'Ẩn bớt':'...xem thêm'}</span>)}
                </p>
              </div>  
            </div>

          </div>
          <div class="bg-white absolute w-full top-[70%]">
            <div className='relative'>
              <h1 class="font-bold mx-4">Bộ sưu tập</h1>
              <div className=' absolute grid grid-cols-4 w-full mx-4'>
                <img src={`${URL_BASE64}${PhotoURL}`} className='rounded-xl w-[100px] h-[100px]' alt='image' />
              </div>
            </div>
          </div>
          <div className="absolute w-[40%] h-[0.5%] left-[30%] top-[98%] bg-black rounded-[2.5px] opacity-80"></div>
        </div>
      </div>
    </>

  )
}

export default Profile
