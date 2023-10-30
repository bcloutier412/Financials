import React, { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'

// Selectors
import { selectUserWatchList, selectUserWatchListStatus } from './watchListSlice'
import { fetchUserWatchList } from "./watchListSlice"

const WatchList = () => {
  const dispatch = useDispatch()
  const watchList = useSelector(selectUserWatchList)
  const status = useSelector(selectUserWatchListStatus)

  useEffect(() => {
    if (status !== 'succeeded') {
      dispatch(fetchUserWatchList());
    }
  }, [])

  return (
    <div>WatchList</div>
  )
}



export default WatchList