import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { selectUserStatus, fetchUser } from '../../features/user/userSlice'

// Components
import SideNav from './SideNav'
import Nav from './Nav'
import Dashboard from './Dashboard'

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const userStatus = useSelector(selectUserStatus)

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser())
    } else if (userStatus === 'failed') {
      return navigate("/login")
    }
  }, [userStatus, dispatch, navigate])

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