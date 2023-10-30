import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { TailSpin } from "react-loading-icons";

import { selectUserStatus, fetchUser } from '../../features/user/userSlice'
import { fetchUserWatchList } from '../../features/watchList/watchListSlice'

// Components
import Nav from './Nav'
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const userStatus = useSelector(selectUserStatus)

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser())
      dispatch(fetchUserWatchList())
    } else if (userStatus === 'failed') {
      return navigate("/login")
    }
  }, [userStatus, dispatch, navigate])

  return (
    <React.Fragment>
      {!(userStatus === "succeeded") ?
        <div className="h-full flex justify-center items-center">
          <TailSpin
            className="h-12 w-12 mx-auto"
            stroke="#3482F6"
            speed={0.75}
          />
        </div>
        :
        <div className="h-full flex flex-col">
          <Nav />
          <Outlet />
          <Footer />
        </div>
      }
    </React.Fragment>
  )
}

export default Home