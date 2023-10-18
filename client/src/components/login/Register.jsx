import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { selectUserStatus, selectUserError, registerUser } from '../../features/user/userSlice'
import Logo from '../icons/Logo'
import HeroImage from './HeroImage';

const Register = () => {
  const navigate = useNavigate();
  const userStatus = useSelector(selectUserStatus);

  useEffect(() => {
    if (userStatus === 'succeeded') {
      navigate("/")
    }
  }, [userStatus, navigate])

  return (
    <div className="relative container flex h-full m-auto p-5 items-center">
      <div className="absolute top-8 left-8">
        <Logo width="40" height="40"/>
      </div>
      <RegisterForm />
      <HeroImage />
    </div>
  )
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
  })

  const dispatch = useDispatch();
  const errorMessage = useSelector(selectUserError);

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      name: inputs["name"],
      username: inputs["username"].toLowerCase(),
      password: inputs["password"],
    };
    dispatch(registerUser(data));
  }

  return (
    <div className="container px-[5%]">
      <header className="text-3xl mb-2">Get Started Now</header>
      <p className="text-sm tracking-tight mb-8 text-secondaryText">Enter your credentials to create your account</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm" htmlFor="name">Full Name</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="name" type="text" name="name" value={inputs["name"]} onChange={handleChange} placeholder="John Doe" required autoFocus/>
        <label className="text-sm" htmlFor="username">Username</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="username" type="text" name="username" value={inputs["username"]} onChange={handleChange} placeholder="Johndoe123" required/>
        <label className="text-sm" htmlFor="password">Password</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="password" type="password" name="password" value={inputs["password"]} onChange={handleChange} placeholder="Password" required />
        <div className="text-errorText text-sm">{errorMessage}</div>
        <button className="center bg-primary text-white rounded-2xl px-2 py-3" type="submit">Register</button>
        <footer>Already have an account? <span className="text-primary hover:cursor-pointer" onClick={() => navigate("/login")}>Login</span></footer>
      </form>
    </div>
  )
}

export default Register