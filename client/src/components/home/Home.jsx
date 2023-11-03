import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { TailSpin } from "react-loading-icons";

import { selectUserStatus, fetchUser } from '../../features/user/userSlice'

// Components
import Nav from './Nav'
import Footer from './Footer';
import WatchList from '../../features/watchList/WatchList';

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
    <React.Fragment>
      {!(userStatus === "succeeded") ?
        <div className="h-screen flex justify-center items-center">
          <TailSpin
            className="h-12 w-12 mx-auto"
            stroke="#3482F6"
            speed={0.75}
          />
        </div>
        :
        <div className="h-screen flex flex-col relative">
          <Nav />
          <WatchList />
          <Outlet />
          <Footer />
        </div>
      }
    </React.Fragment>
  )
}

export default Home