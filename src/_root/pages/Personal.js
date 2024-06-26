import axios from 'axios'
import { React, useEffect, useState, useRef } from 'react'
import 'react-calendar/dist/Calendar.css'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import Header2 from '../../components/header/Header2'
import Footer from '../../components/shared/Footer'
import background from '../../images/bg3.jpg'

import { joiResolver } from '@hookform/resolvers/joi'
import { profileSchema } from '../../schemas/profile'

import { Auth } from '../../components/shared/Auth'
import { getProfile } from '../../components/shared/getProfile'

const FormField = (props) => {
  const { errors, register, name, label } = props.data
  return (
    <div
      className={`${
        errors.FullName ? 'border-red-400' : 'border-[#008748]'
      } border border-solid p-2 mt-5 overflow-hidden bg-white rounded-md`}
    >
      <label className="text-xs font-light text-black" htmlFor={name}>
        {label}
      </label>
      <input
        type={name === 'BirthDate' ? 'date' : 'text'}
        id={name}
        placeholder={label}
        className="block w-full text-xs font-semibold text-black bg-white outline-none placeholder:font-normal"
        {...register(`${name}`)}
      />
      {errors[name] && (
        <p className="mt-1 text-xs font-bold text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  )
}

const formFieldList = [
  {
    id: 1,
    name: 'Bio',
    label: 'Bio',
  },
  {
    id: 2,
    name: 'FullName',
    label: 'Tên',
  },
  {
    id: 3,
    name: 'BirthPlace',
    label: 'Quê quán',
  },

  {
    id: 4,
    name: 'BirthDate',
    label: 'Ngày sinh',
  },
  {
    id: 5,
    name: 'Phone',
    label: 'Số điện thoại',
  },
  {
    id: 6,
    name: 'CurrentAdd',
    label: 'Địa chỉ',
  },
]

function Personal() {
  const [avatar, setAvatar] = useState({ image: null, isChangeImage: false })
  const { userName, userID } = new Auth()

  const backgroundImage = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    // backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile(userName)
      console.log('data', res)
      setAvatar({ ...avatar, image: res.avatarLink })
    }

    fetchProfile()
  }, [])

  // *________________ SAVE FINDING_______________

  const [radius, setRadius] = useState('0')
  const [age, setAge] = useState('12')
  const [gender1, setGender1] = useState('Nam')

  const onHandleChangeRadius = (e) => {
    setRadius(e.target.value)
  }
  const onHandleChangeAge = (e) => {
    setAge(e.target.value)
  }
  const onHandleChangeGender = (e) => {
    setGender1(e.target.value)
  }
  const onHandleSave = () => {
    const findingSetting = {
      radius: radius,
      maxAge: age,
      gender: gender1,
    }
    localStorage.setItem('findingSetting', JSON.stringify(findingSetting))
    toast.success('Lưu cài đặt thành công!', { autoClose: 1000 })
  }

  // * ___________  handle FORM ___________

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: async () => {
      const { Bio, FullName, BirthDate, BirthPlace, CurrentAdd, Phone } =
        await getProfile(userName)
      return {
        Bio,
        FullName,
        BirthDate,
        BirthPlace,
        CurrentAdd,
        Phone,
      }
    },

    resolver: joiResolver(profileSchema),
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result
      if (imageUrl !== avatar.image)
        setAvatar({ ...avatar, image: imageUrl, isChangeImage: true })
    }

    reader.readAsDataURL(file)
  }

  console.log(avatar.image)

  const patchAvatar = async (image) => {
    const data = {
      PhotoURL: image,
      SetAsAvatar: true,
    }

    const response = await axios.post(
      `https://api.iudi.xyz/api/profile/add_image/259`,
      data
    )
  }

  const onSubmit = async (data) => {
    if (avatar.isChangeImage) {
      await patchAvatar(avatar.image)
    }

    try {
      const response = await axios.put(
        `https://api.iudi.xyz/api/profile/change_profile/${userID}`,
        data
      )
    } catch (err) {
      console.log(err)
    }
  }

  // * _______ SET HEIGHT  ________
  const [heightHeader, setHeightHeader] = useState(150)
  const [widthSidebar, setWidthSidebar] = useState(400)
  const [isDark, setIsDark] = useState(false)
  const sidebarRef = useRef()

  const contentStyles = {
    marginTop: `${heightHeader}px`,
    marginLeft: `${widthSidebar}px`,
    width: `calc(100% - ${widthSidebar}px)`,
    display: 'flex',
    justifyContent: 'center',
  }

  const getHeightHeader = (height) => setHeightHeader(height)

  useEffect(() => {
    window.onscroll = () => {
      document.documentElement.scrollTop > 0
        ? setIsDark(true)
        : setIsDark(false)
    }

    setWidthSidebar(sidebarRef?.current.offsetWidth)
  }, [])

  return (
    <div style={backgroundImage} className="">
      <Header2
        isDark={isDark}
        onGetHeight={getHeightHeader}
        isPositionFixed={true}
      />

      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 w-[500px] border-r-2 border-white h-screen"
      >
        <div className="mt-[200px] ml-[50px] mr-[50px]">
          <h1 className="text-3xl font-semibold text-white text-green-600 mb-11">
            Cài đặt tìm kiếm
          </h1>
          <label
            className="mt-8 mb-2 text-sm font-bold text-gray-700 "
            htmlFor="fullname"
            style={{
              color: 'rgba(44,186,55,0.8127626050420168)',
            }}
          >
            <div className="flex justify-between">
              <span className="text-white">Khoảng cách (m): </span>
              <span className="font-bold text-white">{radius}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5000}
              onChange={onHandleChangeRadius}
              className="mt-4 range range-success range-xs range-infor"
            />
          </label>
          <label
            className="block mt-3 mb-2 text-sm font-bold text-white"
            htmlFor="genderr"
          >
            Xu hướng
          </label>

          <select
            onChange={onHandleChangeGender}
            className="w-full px-3 py-2 mt-2 mb-4 text-white bg-white focus:outline-none"
            defaultValue="Nam"
            id="genderr"
          >
            <option className="text-green-600">Nam</option>
            <option className="text-green-600">Nữ</option>
            <option className="text-green-600">Đồng tính Nam</option>
            <option className="text-green-600">Đồng tính nữ</option>
          </select>
          <label
            className="mt-8 mb-2 text-sm font-bold text-gray-700 "
            htmlFor="fullname"
            style={{
              color: 'rgba(44,186,55,0.8127626050420168)',
            }}
          >
            <div className="flex justify-between">
              <span className="text-white">Độ tuổi:</span>
              <span className="font-bold text-white">Từ {age} trở lên</span>
            </div>
            <input
              type="range"
              min={12}
              max={100}
              onChange={onHandleChangeAge}
              className="mt-4 range range-success range-xs range-infor"
            />
          </label>
          <button
            onClick={onHandleSave}
            className="inline-block py-2 mt-8 text-sm text-white rounded shadow bg-green px-11"
            type="button"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
      <div style={contentStyles} className="ml-[600px] pt-[60px]">
        {/* class='bg-[#252525] px-[20px] mt-[60px] ml-[900px] py-[50px] mx-auto w-[490px] border-2 border-green-500 rounded-lg shadow-lg' */}
        <div className="w-[490px] bg-[#252525] border-2 border-green-500 rounded-lg py-[50px] px-[20px]">
          <div className="mb-[15px] flex flex-col items-center ">
            <h1 className="text-[34px] font-semibold text-[#4EC957]">
              Thông tin cá nhân
            </h1>

            <p className="text-white text-[15px] font-[300] mt-2">
              Hãy điền thông tin cá nhân để chúng ta hiểu nhau hơn
            </p>
          </div>

          <div className="flex items-end justify-center">
            <img
              src={`data:image/jpeg;base64,${avatar?.image}`}
              //  src={avatar?.image}
              alt="personal"
              className="w-[100px] h-[100px] rounded-[10px] mr-[5px] object-cover"
            />

            <label htmlFor="imageUpload" className="cursor-pointer">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 bg-[#3d773d] text-white p-[3px] rounded-[5px] hover:cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </label>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {formFieldList.map(({ id, name, label }) => (
              <FormField
                key={id}
                data={{
                  errors,
                  register,
                  name,
                  label,
                }}
              />
            ))}

            <button
              className="hover:opacity-80 duration-200 w-full mt-5 font-semibold text-[20px] text-white rounded-lg h-[55px] shadow bg-[#008748] "
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Lưu'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Personal
