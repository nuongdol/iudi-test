import { joiResolver } from '@hookform/resolvers/joi'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import registerSchema from '../../schemas/register'
import Logo from '../../images/logoApp.png'

const SignupForm = () => {

  const [isLab, setIsLab] = useState(true)
  useEffect(() => {
    setIsLab(window.innerWidth > 399)
    const handleResize = () => {
      window.location.reload();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [isLab])
  const [sta, setSta] = useState(true)


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({ resolver: joiResolver(registerSchema) })

  const getLocation = () => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            // Vị trí đã được cho phép
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords
              setValue('Latitude', latitude)
              setValue('Longitude', longitude)
              setValue(
                'avatarLink',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9Zde21fi2AnY9_C17tqYi8DO25lRM_yAa7Q&usqp=CAU&fbclid=IwAR16g1ONptpUiKuDIt37LRxU3FTZck1cv9HDywe9VWxWSQBwcuGNfB7JUw4'
              )
              setValue('LastLoginIP', '1')
            })
            setSta(true)
          } else if (permissionStatus.state === 'prompt') {
            // Hiển thị cửa sổ xác nhận yêu cầu vị trí
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords
              setValue('Latitude', latitude)
              setValue('Longitude', longitude)
              setValue(
                'avatarLink',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9Zde21fi2AnY9_C17tqYi8DO25lRM_yAa7Q&usqp=CAU&fbclid=IwAR16g1ONptpUiKuDIt37LRxU3FTZck1cv9HDywe9VWxWSQBwcuGNfB7JUw4'
              )
              setValue('LastLoginIP', '1')
              setSta(true)
            }, alert('Vui lòng mở vị trí trước khi tiếp tục!') && setSta(false))
          } else if (permissionStatus.state === 'denied') {
            // Vị trí bị từ chối
            alert('Vui lòng mở vị trí trước khi tiếp tục!')
            setSta(false)
          }
        })
    } else {
      alert(
        'Trình duyệt không hỗ trợ geolocation hoặc trình duyệt chặn truy cập vị trí, vui lòng kiểm tra!.'
      )
      setSta(false)
    }
  }

  useEffect(() => {
    getLocation()
    window.addEventListener('GeolocationPermissionChangeEvent', getLocation)
  }, [])

  const handleSubmitForm = async (data) => {
    if (isValid) {
      try {
        const response = await axios.post(
          'https://api.iudi.xyz/api/register',
          data
        )
        response.data.status === 200 &&
          toast.success('Register successfully!') &&
          reset()
      } catch (error) {
        console.error('Error registering:', error)
        toast.error(`Register failed! ${error.response.data.message}`, {
          closeOnClick: true,
        })
      }
    }
  }

  return (
    <>
        {isLab ?(<div
          className="md:absolute inset-0 flex items-center justify-center sm:hidden"
          style={{ background: 'rgba(255, 255, 255, .3)' }}
        >
          <div className="max-w-md w-full mx-auto border-2 border-green-400 rounded-[20px] bg-gray-900">
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="px-8 pt-6 pb-8 mb-4 rounded "
            >
              <h3
                className="mt-2 mb-2 text-3xl font-extrabold text-center "
                style={{
                  color: 'rgba(44,186,55,0.8127626050420168)',
                }}
              >
                REGISTER
              </h3>
              <div className="mb-4">
                <label
                  className="block mb-2 font-bold text-whitetext-sm"
                  htmlFor="username"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
                  name="Username"
                  {...register('Username')}
                />
                {errors.Username && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {' '}
                    {errors.Username.message}{' '}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-white"
                  htmlFor="fullName"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Full Name
                </label>
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  name="FullName"
                  {...register('FullName')}
                />
                {errors.FullName && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {' '}
                    {errors.FullName.message}{' '}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 font-bold text-whitetext-sm"
                  htmlFor="email"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="Email"
                  {...register('Email')}
                />
                {errors.Email && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {' '}
                    {errors.Email.message}{' '}
                  </p>
                )}
                <input
                  className="hidden w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="avatarLink"
                  type="text"
                  name="avatarLink"
                  {...register('avatarLink')}
                />
                <input
                  className="hidden w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="LastLoginIP"
                  type="text"
                  name="LastLoginIP"
                  {...register('LastLoginIP')}
                />
                <label
                  className="block mt-3 mb-2 font-bold text-whitetext-sm"
                  htmlFor="gender"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Gender
                </label>

                <select
                  className="w-full px-3 py-2 border rounded"
                  id="gender"
                  {...register('Gender')}
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Đồng tính Nam</option>
                  <option>Đồng tính nữ</option>
                </select>
                {errors.Gender && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {' '}
                    {errors.Gender.message}{' '}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 font-bold text-whitetext-sm"
                  htmlFor="password"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="Password"
                  {...register('Password')}
                />
              </div>
              {errors.Password && (
                <p className="mt-2 text-sm font-bold text-red-500">
                  {' '}
                  {errors.Password.message}{' '}
                </p>
              )}
              <div className="mb-4">
                <label
                  className="block mb-2 font-bold text-whitetext-sm"
                  htmlFor="password"
                  style={{
                    color: 'rgba(44,186,55,0.8127626050420168)',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
                  id="cf_password"
                  type="password"
                  placeholder="Confirm Password"
                  name="Cf_Password"
                  {...register('Cf_Password')}
                />
                {errors.Cf_Password && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {' '}
                    {errors.Cf_Password.message}{' '}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <button
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(29,120,36,1) 0%, rgba(44,186,55,0.8127626050420168) 90%, rgba(0,255,68,1) 100%)',
                  }}
                  className={`w-full  py-2 px-4 ${sta ? '' : 'bg-black'
                    } font-bold rounded focus:outline-none text-white`}
                  type="submit"
                  disabled={!sta}
                >
                  Register
                </button>
              </div>
              <p
                className="text-sm text-center"
                style={{
                  color: 'rgba(44,186,55,0.8127626050420168)',
                }}
              >
                Already have an account ?{' '}
                <a href="/login" className="text-500">
                  <strong>LOG IN</strong>
                </a>
              </p>
            </form>
          </div>
        </div>):

        (<div className="sm:absolute inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.3)] md:hidden">
          <div className="relative w-[100%] h-full bg-white overflow-hidden">
            <div className="absolute top-[0] left[0] w-[100%] h-[45%] bg-white overflow-hidden">
              <div className='absolute w-[130%] h-[145%] top-[-54%] left-[-40%] -mt-20 -ml-1' style={{
                borderRadius: "50%",
                backgroundColor: "rgba(0,135,72,0.7)",
              }}></div>
              <div className="absolute w-[60%] h-[40%] left-[10%] top-[25%] -mt-6">
                <img src={Logo} alt="Your" style={{ width: "90%" }} />
              </div>
              <p className="absolute text-white font-light text-[18px] leading-[90%] tracking-[-90%] text-center w-[90%] h-[100%] top-[60%] left-[-15%] -mt-14">
                Kết nối yêu thương
              </p>
              <div className="absolute w-[70%] h-[70%] top-[-16%] left-[60%] mr-8 mt-3" style={{
                borderRadius: "50%",
                backgroundColor: "rgba(20,145,87,0.9)",
              }}></div>
            </div>
            <div className="relative mr-8 h-[40%] left-[5%] top-[42%] -mt-20">
              <form onSubmit={handleSubmit(handleSubmitForm)}
                >
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="Username">Tên tài khoản</label>
                  <input
                    className="w-full container mx-auto px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="Username"
                    type="text"
                    placeholder="Tên tài khoản"
                    name="Username"
                    {...register('Username')}
                  />
                  {errors.Username && (
                    <p className='mt-2 text-sm font-bold text-red-500'>
                      {' '}
                      {errors.Username.message}{' '}
                    </p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="Fullname">Họ tên</label>
                  <input
                    className="w-full container mx-auto px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="Fullname"
                    type="text"
                    placeholder="Họ tên"
                    name="FullName"
                    {...register('FullName')}
                  />
                  {errors.FullName && (
                    <p className='mt-2 text-sm font-bold text-red-500'>
                      {' '}
                      {errors.FullName.message}{' '}
                    </p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="email">Email</label>
                  <input
                    className="w-full px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    name="Email"
                    {...register('Email')}
                  />
                  {errors.Email && (
                    <p className="mt-2 text-sm font-bold text-red-500">{' '}
                    {errors.Email.message}{' '}</p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="gender">Giới tính</label>
                  <select
                    className="w-full px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="gender"
                    {...register('Gender')}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Đồng tính Nam</option>
                    <option>Đồng tính nữ</option>
                  </select>
                  {errors.Gender && (
                    <p className="mt-2 text-sm font-bold text-red-500">{' '}
                    {errors.Gender.message}{' '}</p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="password">Mật khẩu</label>
                  <input
                    className="w-full px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Password"
                    name="Password"
                    {...register('Password')}
                  />
                  {errors.Password && (
                    <p className="mt-2 text-sm font-bold text-red-500"> {' '}
                  {errors.Password.message}{' '}</p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block py-1 font-bold text-black text-sm" htmlFor="cf_password">Nhập lại mật khẩu</label>
                  <input
                    className="w-full px-2 py-1 border-2 border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
                    id="cf_password"
                    type="password"
                    placeholder="Confirm Password"
                    name="Cf_Password"
                    {...register('Cf_Password')}
                  />
                  {errors.Cf_Password && (
                    <p className="mt-2 text-sm font-bold text-red-500">
                      {' '}
                      {errors.Cf_Password.message}{' '}
                    </p>
                  )}
                </div>
                <div className="mb-1 py-1 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 border border-black rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                      name='Checkbox'
                    />
                  </div>
                  <div className="ml-1 text-sm">
                    <label className="block font-bold text-black text-sm" htmlFor="remember"><small>Đăng kí điều khoản và điều kiện</small></label>
                  </div>
                </div>
                <div className="mb-1 py-2">
                  <button
                    className={`w-full px-2 py-1 ${sta ? '' : 'bg-black'} font-bold rounded-full focus:outline-none text-white`}
                    style={{ background: sta ? 'rgba(0, 135, 72, 1)' : 'black' }}
                    type="submit"
                    disabled={!sta}>
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
            <div className="absolute w-[60%] h-[10%] left-[20%] top-[90%] font-medium text-sm leading-[21px]">
              <div className="mt-7 -ml-5">
                <p className="text-sm text-center mb-4 text-black">
                  Bạn đã có tài khoản?{' '}
                  <a href="/login" className="text-500">
                    <strong className="text-[rgba(0,135,72,1)]">Đăng nhập</strong>
                  </a>
                </p>
              </div>
            </div>
            <div className="absolute w-[40%] h-[0.5%] left-[30%] top-[98%] bg-black rounded-[2.5px] opacity-80"></div>
          </div>
        </div>)}
    </>
  )
}

export default SignupForm
