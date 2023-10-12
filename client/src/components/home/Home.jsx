import { useEffect } from 'react'
import axios from 'axios'

// Components
import SideNav from './SideNav'
import Nav from './Nav'
import Dashboard from './Dashboard'

const Home = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const result = await axios.get("/api/auth/testing")
      console.log(result)
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