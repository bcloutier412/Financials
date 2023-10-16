import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { selectUserStatus, selectUserError, loginUser } from '../../features/user/userSlice'

const Login = () => {
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStatus = useSelector(selectUserStatus);
  const errorMessage = useSelector(selectUserError)

  useEffect(() => {
    if (userStatus === 'succeeded') {
      navigate("/")
    }
  }, [userStatus, navigate])

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>{errorMessage}</div>
        <input type="text" name="username" value={inputs["username"]} onChange={handleChange} placeholder="Username" required />
        <input type="password" name="password" value={inputs["password"]} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login