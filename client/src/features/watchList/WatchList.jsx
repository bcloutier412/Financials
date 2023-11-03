import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import protobuf from 'protobufjs';

// Selectors
import { selectUserWatchList, selectUserWatchListStatus } from './watchListSlice'
import { fetchUserWatchList } from "./watchListSlice"

// Components
import Plus from '../../components/icons/Plus';
import PlaceholderLoading from 'react-placeholder-loading'

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
    <div className="bg-primaryBackground">
      {status === "succeeded" &&
        <div className="container overflow-x-scroll no-scrollbar flex px-1 py-1 m-auto gap-2 lg:px-0 ">
          {watchList.map(ticker => {
            return <WatchListWidget key={ticker} ticker={ticker} />
          })}
          <div className="h-[75px] bg-white rounded flex items-center hover:cursor-pointer hover:text-primary shadow px-4">
            <Plus width="20" height="20" />
          </div>
        </div>}
    </div>
  )
}

const WatchListWidget = ({ ticker }) => {
  const [fullCompName, setFullCompName] = useState(null);
  const [marketPrice, setMarketPrice] = useState(null);
  const [marketPercentChange, setMarketPercentChange] = useState(null);

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
    <div className="shrink-0 bg-white rounded shadow flex p-2 items-center gap-6 px-2">
      <div className="flex">
        <div className="flex flex-col w-[120px]">
          <div className="font-medium tracking-tight text-primary hover:cursor-pointer hover:underline">{ticker}</div>
          <div className="font-light text-sm tracking-tight text-secondaryText truncate">{fullCompName ? fullCompName : <PlaceholderLoading shape="rect" width="120" height="20"/>}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Market Price</div>
        <div className="text-increase">{marketPrice ? marketPrice : <PlaceholderLoading shape="rect" width="79.82" height="20"/>}</div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Change</div>
        <div className="text-increase">{marketPercentChange ? marketPercentChange : <PlaceholderLoading shape="rect" width="54.03" height="20"/>}</div>
      </div>

    </div>
  )
}

export default WatchList