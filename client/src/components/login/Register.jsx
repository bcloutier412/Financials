import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { selectUserStatus, selectUserError, registerUser } from '../../features/user/userSlice'
import Logo from '../icons/Logo'
import HeroImage from './HeroImage';
import { EyeSlash, Eye } from '../icons/Eye';

const Register = () => {
  const navigate = useNavigate();
  const userStatus = useSelector(selectUserStatus);

  useEffect(() => {
    if (userStatus === 'succeeded') {
      navigate("/home")
    }
  }, [userStatus, navigate])

  return (
    <div className="relative container flex h-full m-auto p-5 items-center">
      <div className="absolute top-8 left-8">
        <Logo width="40" height="40" />
      </div>
      <RegisterForm />
      <HeroImage />
    </div>
  )
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectUserError);
  const [showPassword, setShowPassword] = useState(false)
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputs.password !== inputs.confirmPassword) {
      console.log("password different")
      return
    }
    const name = capitalizeFirstLetter(inputs["firstName"]).concat(" ", capitalizeFirstLetter(inputs["lastName"]))
    const data = {
      name: name,
      username: inputs["username"].toLowerCase(),
      password: inputs["password"],
    };
    dispatch(registerUser(data));
  }
  const isValidInputs = useMemo(() => {
    console.log("memo")
    return validateInputs(inputs)
  }, [inputs])

  return (
    <div className="container px-[5%]">
      <header className="text-3xl mb-2">Get Started Now</header>
      <p className="text-sm tracking-tight mb-8 text-secondaryText">Enter your credentials to create your account</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-6">
          <div className="flex flex-col grow gap-4">
            <label className="text-sm" htmlFor="name">First Name</label>
            <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="firstName" type="text" name="firstName" value={inputs["firstName"]} onChange={handleChange} placeholder="John" required autoFocus />
          </div>
          <div className="flex flex-col grow gap-4">
            <label className="text-sm" htmlFor="name">Last Name</label>
            <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="lastName" type="text" name="lastName" value={inputs["lastName"]} onChange={handleChange} placeholder="Doe" required autoFocus />
          </div>
        </div>
        <label className="text-sm" htmlFor="username">Username</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="username" type="text" name="username" value={inputs["username"]} onChange={handleChange} placeholder="Johndoe123" required />
        <label className="text-sm" htmlFor="password">Password</label>
        <div className="relative">
          <input className="w-full shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="password" type={showPassword ? "text" : "password"} name="password" value={inputs["password"]} onChange={handleChange} placeholder="Password" required />
          <div className="absolute top-[50%] translate-y-[-50%] right-5 hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye width="20" height="20 " /> : <EyeSlash width="20" height="20 " />}
          </div>
        </div>
        <label className="text-sm" htmlFor="confirmPassword">Confirm Password</label>
        <input className={`shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 ${inputs.confirmPassword !== "" && !isValidInputs ? "focus:outline-error" : "focus:outline-primary"} focus:shadow-md" id="confirmPassword`} type={showPassword ? "text" : "password"} name="confirmPassword" value={inputs["confirmPassword"]} onChange={handleChange} placeholder="Confirm Password" required />
        <div className="text-error text-sm">{errorMessage}</div>
        <button className={`center ${isValidInputs ? "bg-primary" : "bg-unconfirmedButton hover:cursor-not-allowed"} text-white rounded-2xl px-2 py-3`} type="submit" disabled={!isValidInputs}>Register</button>
        <footer>Already have an account? <span className="text-primary hover:cursor-pointer" onClick={() => navigate("/login")}>Login</span></footer>
      </form>
    </div>
  )
}

const validateInputs = (inputs) => {
  if (inputs.password === inputs.confirmPassword && inputs.password !== "" && inputs.firstName && inputs.lastName && inputs.username) {
    return true
  }

  return false
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Register