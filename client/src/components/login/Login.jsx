import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { selectUserStatus, selectUserError, loginUser, resetError } from '../../features/user/userSlice'
import Logo from '../icons/Logo'
import HeroImage from './HeroImage';

const Login = () => {
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
        <Logo width="40" height="40" />
      </div>
      <LoginForm />
      <HeroImage />
    </div>
  )
}

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectUserError);
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    return () => {dispatch(resetError())}
  }, [])

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      username: inputs["username"].toLowerCase(),
      password: inputs["password"],
    };
    dispatch(loginUser(data));
  }

  return (
    <div className="container px-[5%]">
      <header className="text-3xl mb-2">Get Started Now</header>
      <p className="text-sm tracking-tight mb-8 text-secondaryText">Enter your credentials to access your account</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm" htmlFor="username">Username</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="username" type="text" name="username" value={inputs["username"]} onChange={handleChange} placeholder="Johndoe123" required autoFocus />
        <label className="text-sm" htmlFor="password">Password</label>
        <input className="shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-3 focus:outline-primary focus:shadow-md" id="password" type="password" name="password" value={inputs["password"]} onChange={handleChange} placeholder="Password" required />
        <div className="text-errorText text-sm">{errorMessage}</div>
        <button className={`center ${validateInputs(inputs) ? "bg-primary" : "bg-unconfirmedButton"} text-white rounded-2xl px-2 py-3`} type="submit">Login</button>
        <footer>Need an account? <span className="text-primary hover:cursor-pointer" onClick={() => navigate("/register")}>Sign up</span></footer>
      </form>
    </div>
  )
}

const validateInputs = (inputs) => {
  if (inputs.username && inputs.password) {
    return true
  }
  return false
}
export default Login