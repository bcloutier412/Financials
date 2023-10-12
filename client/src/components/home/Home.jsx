import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Components
import SideNav from './SideNav'
import Nav from './Nav'
import Dashboard from './Dashboard'

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get("/api/auth/testing")
        console.log(result)
      } catch (error) {
        console.log(error)
        return navigate("/login")
      }
    }
    fetchUser()
  })
  return (
    <div className="h-full flex">
      {/* SIDE NAV */}
      <SideNav />

      {/* 
        CONTAINER:
          CONTAINER:
            Overall performance
            Portfolio diversity
          Benchmark performance
      */}
      <main className="grow">
        <Nav />
        <Dashboard />
      </main>
  </div>
  )
}

export default Home