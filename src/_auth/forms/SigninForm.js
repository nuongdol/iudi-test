import axios from 'axios'
import React, { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import loginSchema from '../../schemas/login'
import config from '../../configs/Configs.json'
import Logo from '../../images/logoApp.png'


const { LONGITUDE_DEFAULT, LATITUDE_DEFAULT, LAST_LOGIN_IP_DEFAULT } = config

function SigninForm() {
  
  // const [isLab, setIsLab] = useState(true)
  // useEffect(() => {
  //   setIsLab(window.innerWidth > 399)
  //   const handleResize = () => {
  //     window.location.reload();
  //   }
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };

  // }, [isLab])

 const {
  register,
  handleSubmit,
  setValue,
  formState: { errors, isValid },
 } = useForm({ resolver: joiResolver(loginSchema) })

 useEffect(() => {
  const fetchData = async () => {
   fetch('http://www.geoplugin.net/json.gp?ip')
    .then((response) => response.json())
    .then((data) => {
     console.log(data)
     setValue('Latitude', data.geoplugin_latitude)
     setValue('Longitude', data.geoplugin_longitude)
     setValue('LastLoginIP', data.geoplugin_request)
    })
    .catch((error) => {
     console.error('Error fetching data:', error)

     setValue('Latitude', LONGITUDE_DEFAULT)
     setValue('Longitude', LATITUDE_DEFAULT)
     setValue('LastLoginIP', LAST_LOGIN_IP_DEFAULT)
    })
  }
  fetchData()
 }, [])

 const navigate = useNavigate()
 const handleLogin = async (data) => {
  console.log('data form:', data)

  if (isValid) {
   try {
    const response = await axios.post('https://api.iudi.xyz/api/login', data)
    const user = response?.data?.user.Users[0]

    console.log('response:', response)
    console.log('Phản hồi từ API:', response?.data)

    localStorage.setItem('IuDiToken', response?.data?.jwt)
    localStorage.setItem('UserId', user.UserID)
    localStorage.setItem('UserNameIuDi', user.Username)

    toast.success('Login successfully!', {
     position: 'bottom-right',
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: 1,
     theme: 'light',
    })

    setTimeout(() => {
     navigate('/personal')
    }, 1000)
   } catch (error) {
    console.error('Error registering:', error)
    toast.error(`Register failed! ${error.response.data.message}`, {
     closeOnClick: true,
    })
   }
  } else toast.warning('An error occur...')
 }

 return (
  <>
  <div
   className="md:absolute inset-0 flex items-center justify-center sm:hidden"
   style={{ background: 'rgba(255, 255, 255, .3)' }}
  >
   <div className='max-w-md w-full mx-auto border-2 border-green-400 rounded-[20px] bg-gray-900'>
    <form
     onSubmit={handleSubmit(handleLogin)}
     className='px-8 pt-6 pb-8 mb-4 rounded '
    >
     {/* <ToastContainer/> */}
     <h3
      style={{
       color: 'rgba(44,186,55,0.8127626050420168)',
      }}
      className='mt-2 mb-2 text-3xl font-extrabold text-center text-white'
     >
      LOGIN
     </h3>
     <div className='mb-4'>
      <label
       className='block mb-2 font-bold text-whitetext-sm'
       htmlFor='Username'
       style={{
        color: 'rgba(44,186,55,0.8127626050420168)',
       }}
      >
       Username
      </label>
      <input
       className='w-full px-3 py-2 border rounded shadow appearance-none text-whiteleading-tight focus:outline-none focus:shadow-outline'
       id='Username'
       type='text'
       placeholder='Username'
       name='Username'
       {...register('Username')}
      />

      {errors.Username && (
       <p className='mt-2 text-sm font-bold text-red-500'>
        {' '}
        {errors.Username.message}{' '}
       </p>
      )}
     </div>
     <div className='mb-4'>
      <label
       className='block mb-2 font-bold text-whitetext-sm'
       htmlFor='Password'
       style={{
        color: 'rgba(44,186,55,0.8127626050420168)',
       }}
      >
       Password
      </label>
      <input
       className='w-full px-3 py-2 border rounded shadow appearance-none text-whiteleading-tight focus:outline-none focus:shadow-outline'
       id='Password'
       type='password'
       placeholder='Password'
       name='Password'
       {...register('Password')}
      />
      {errors.Password && (
       <p className='mt-2 text-sm font-bold text-red-500'>
        {' '}
        {errors.Password.message}{' '}
       </p>
      )}
     </div>
     <div className='mb-4'>
      <button
       style={{
        background: 'rgba(44,186,55,0.8127626050420168)',
       }}
       className='w-full px-4 py-2 mt-2 font-bold text-white rounded focus:outline-none focus:shadow-outline'
       type='submit'
      >
       Login
      </button>
     </div>
     <p
      className='text-sm text-center text-white'
      style={{
       color: 'rgba(44,186,55,0.8127626050420168)',
      }}
     >
      Don't have an account ?
      <a href='/register' className='text-500'>
       <strong>REGISTER</strong>
      </a>
     </p>
     <p className='mt-2 text-center text-green-600'>
      <a href='/forgot-password' className='text-200'>
       <strong>Forgot password ?</strong>
      </a>
     </p>
    </form>
   </div>
  </div>
  </>
 )
}
export default SigninForm
