import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import protobuf from 'protobufjs';

// Selectors
import { selectUserWatchList, selectUserWatchListStatus, addToUserWatchList, selectUserWatchListError, deleteWatchListTicker, resetError } from './watchListSlice'
import { fetchUserWatchList } from "./watchListSlice"

// Components
import Plus from '../../components/icons/Plus';
import Minus from "../../components/icons/Minus";
import PlaceholderLoading from 'react-placeholder-loading'
import { TailSpin } from "react-loading-icons";
import XIcon from "../../components/icons/XIcon";

const WatchList = () => {
  const dispatch = useDispatch()
  const watchList = useSelector(selectUserWatchList)
  const watchListStatus = useSelector(selectUserWatchListStatus)
  const [editIsActive, setEditIsActive] = useState(false)

  // Fetch watchlist if it isnt in the state
  useEffect(() => {
    if (watchListStatus !== 'succeeded') {
      dispatch(fetchUserWatchList());
    }
  }, [])

  /**
   * @Scroll_To_End- When a user clicks on the plus sign it scrolls to the end of the container
   */
  const containerRef = useRef(null);

  const scrollToEnd = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  };

  return (
    <div className="bg-primaryBackground">

      <div ref={containerRef} className="container overflow-x-scroll custom-scrollbar flex px-1 pt-1 m-auto gap-2 lg:px-0 lg:pb-1 pb-3">
        {watchListStatus === "loadingTickers" && <div>Loading Tickers</div>}
        {watchList.map(ticker => {
          return <WatchListWidget key={ticker} ticker={ticker} editIsActive={editIsActive} />
        })}
        <EditWatchListButton setEditIsActive={setEditIsActive} editIsActive={editIsActive} />
        <AddWatchListButton scrollToEnd={scrollToEnd} />
      </div>
    </div>
  )
}

const WatchListWidget = ({ ticker, editIsActive }) => {
  const dispatch = useDispatch()
  const [fullCompName, setFullCompName] = useState(null);
  const [marketPrice, setMarketPrice] = useState(null);
  const [marketPercentChange, setMarketPercentChange] = useState(null);
  const handleDelete = (removedTicker) => {
    console.log('delete')
    dispatch(deleteWatchListTicker(removedTicker));
  }
  useEffect(() => {
    // const ws = new WebSocket('wss://streamer.finance.yahoo.com')

    // ws.onopen = function open() {
    //   console.log('connected');
    //   ws.send(JSON.stringify({
    //     subscribe: [ticker]
    //   }))
    // }

    // ws.onclose = function close() {
    //   console.log('disconnected')
    // }

    // ws.onmessage = function incoming(data) {
    //   console.log(`coming message ${ticker}`)
    //   console.log(data)
    // }

    // callAPIsAndPopulateState()
    // Call chart api
    // Call quote api
  }, [])

  return (
    <div className="relative shrink-0 bg-white rounded shadow flex p-2 items-center gap-6 px-2">
      <div className="flex">
        <div className="flex flex-col w-[120px]">
          <div className="font-medium tracking-tight text-primary hover:cursor-pointer hover:underline">{ticker}</div>
          <div className="font-light text-sm tracking-tight text-secondaryText truncate">{fullCompName ? fullCompName : <PlaceholderLoading shape="rect" width="120" height="20" />}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Market Price</div>
        <div className="text-increase">{marketPrice ? marketPrice : <PlaceholderLoading shape="rect" width="79.82" height="20" />}</div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Change</div>
        <div className="text-increase">{marketPercentChange ? marketPercentChange : <PlaceholderLoading shape="rect" width="54.03" height="20" />}</div>
      </div>
      {editIsActive &&
        <div onClick={() => handleDelete(ticker)} className="absolute -right-1 -top-1 bg-error rounded-full p-[2px] hover:cursor-pointer text-sm text-white">
          <XIcon width="15px" height="15px" fill="white" />
        </div>}
    </div>
  )
}

const AddWatchListButton = ({ scrollToEnd }) => {
  const [isActive, setIsActive] = useState(false);
  const [tickerInput, setTickerInput] = useState('')
  const dispatch = useDispatch()
  const watchListStatus = useSelector(selectUserWatchListStatus)
  const watchListError = useSelector(selectUserWatchListError)

  // Handle Form Submission
  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch(addToUserWatchList(tickerInput));
  }

  // Handle Input for ticker
  const handleInputChange = (e) => {
    setTickerInput(e.target.value)
  }

  // If the user clicks the plus or minus sign it toggles active attribute to show or close widget
  const toggleIsActive = () => setIsActive(!isActive)

  // Side Effects when the widget opens or closes: 
  // open -> scroll to end of container
  // close -> clear input and reset watchList error
  useEffect(() => {
    if (isActive) {
      scrollToEnd()
    } else {
      setTickerInput('');
      if (watchListError) dispatch(resetError())
    }
  }, [isActive])

  // Side effect when 
  useEffect(() => {
    if (watchListStatus === "succeededToAddTicker") setTickerInput('');
  }, [watchListStatus])

  return (
    <div className="h-[75px] bg-white rounded flex items-center shadow">
      {isActive &&
        <div className="transition-[height] w-max">
          {watchListStatus === "failedToAddTicker" && <div className="text-error text-xs truncate pl-1 mb-1">{watchListError}</div>}
          <form className="flex gap-2" onSubmit={onSubmit}>
            <input className="ml-2 shadow appearance-none border border-secondaryOutline rounded-2xl px-3 py-1 focus:outline-primary focus:shadow-md w-[185px]" placeholder="Ticker" value={tickerInput} onChange={handleInputChange} />
            <button className="bg-primary text-white rounded-2xl px-3 py-3`" type="submit">Add</button>
          </form>
        </div>
      }

      {/** Displaying Plus or Minus */}
      {isActive ?
        <div className="ml-2 py-2 px-4 h-full flex items-center hover:cursor-pointer hover:text-primary" onClick={toggleIsActive}><Minus width="20" height="20" /></div> :
        <div className="py-2 px-4 h-full flex items-center hover:cursor-pointer hover:text-primary" onClick={toggleIsActive}><Plus width="20" height="20" /></div>}
    </div>
  )
}

const EditWatchListButton = ({ editIsActive, setEditIsActive }) => {
  return (
    <div onClick={() => setEditIsActive(!editIsActive)} className="h-[75px] bg-white rounded flex justify-center items-center shadow font-light hover:cursor-pointer hover:text-primary">
      {editIsActive ? <p className="px-2">Submit</p> : <p className="w-[52px] text-center">Edit</p>}
    </div>
  )
}

export default WatchList