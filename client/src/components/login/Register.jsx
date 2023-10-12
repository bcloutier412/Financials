import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
    const data = {
      username: inputs["username"].toLowerCase(),
      password: inputs["password"],
      name: inputs["name"],
  };
    const headers = {
      "Content-Type": "application/json",
  };
    const result = await axios.post("http://localhost:3000/api/auth/register", data, { headers })
    console.log(result)
    if (result.status === 201) { 
      return navigate("/")
     }
    } catch (error) {
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
    }
  }
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>{errorMessage}</div>
        <input type="text" name="name" value={inputs["name"]} onChange={handleChange} placeholder="Full Name" required/>
        <input type="text" name="username" value={inputs["username"]} onChange={handleChange} placeholder="Username" required/>
        <input type="password" name="password" value={inputs["password"]} onChange={handleChange} placeholder="Password" required/>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Register