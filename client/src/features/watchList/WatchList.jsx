import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from 'react-redux'
import quoteService from '../../api/quoteService';
import axios from 'axios'
import protobuf from 'protobufjs';
import { Buffer } from 'buffer/';

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
   * @Scroll_To_End When a user clicks on the plus sign it scrolls to the end of the container
   */
  const scrollContainerRef = useRef(null);

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  };

  return (
    <div className="bg-primaryBackground">
      <div ref={scrollContainerRef} className="container overflow-x-scroll custom-scrollbar flex px-1 pt-1 m-auto gap-2 lg:px-0 lg:pb-1 pb-3">
        {/** If Loading tickers render LoadingTickers component */}
        {/** If Failed to Load Tickers render failedLoadingTickers */}
        {/** Anything Else render the watchList */}
        {watchListStatus === "loadingTickers" ? <LoadingTickers /> :
          watchListStatus === "failedLoadingTickers" ? <ErrorLoadingTickers /> :
            <React.Fragment>
              {watchList.map(ticker => {
                return <WatchListWidget key={ticker} ticker={ticker} editIsActive={editIsActive} />
              })}
              <EditWatchListButton setEditIsActive={setEditIsActive} editIsActive={editIsActive} />
              <AddWatchListButton scrollToEnd={scrollToEnd} />
            </React.Fragment>
        }
      </div>
    </div>
  )
}

const WatchListWidget = ({ ticker, editIsActive }) => {
  const dispatch = useDispatch()
  const [fullCompName, setFullCompName] = useState(null);
  const [marketPrice, setMarketPrice] = useState(null);
  const [marketPercentChange, setMarketPercentChange] = useState(null);
  const [marketPercentChangeIncrease, setMarketPercentChangeIncrease] = useState(null);

  const handleDelete = (removedTicker) => dispatch(deleteWatchListTicker(removedTicker));
  const calculatePercentageChange = (pastMarketPrice, marketPrice) => {
    const priceChange = (((marketPrice - pastMarketPrice) / pastMarketPrice) * 100).toFixed(2)
    setMarketPercentChange(priceChange)

    marketPrice >= pastMarketPrice ? setMarketPercentChangeIncrease(true) : setMarketPercentChangeIncrease(false)
  }
  useEffect(() => {
    const callAPIsAndPopulateState = async () => {
      const response = await quoteService.getQuoteChartAndSearch(ticker);

      const r_fullCompName = response.data.data.quote.quotes[0].shortname
      const r_marketPrice = response.data.data.chart.meta.regularMarketPrice.toFixed(2)
      const r_pastMarketPrice = response.data.data.chart.meta.previousClose.toFixed(2)

      setFullCompName(r_fullCompName)
      setMarketPrice(r_marketPrice)
      calculatePercentageChange(r_pastMarketPrice, r_marketPrice)


      const ws = new WebSocket('wss://streamer.finance.yahoo.com');
      protobuf.load('../../../public/YPricingData.proto', (error, root) => {
        if (error) {
          return console.log(error);
        }
        const Yaticker = root.lookupType('yaticker');

        ws.onopen = function open() {
          console.log('connected');
          ws.send(
            JSON.stringify({
              subscribe: [ticker.toUpperCase()],
            })
          );
        };

        ws.onclose = function close() {
          console.log('disconnected');
        };

        ws.onmessage = function incoming(message) {
          const data = Yaticker.decode(new Buffer(message.data, 'base64'));
          const newMarketPrice = data.price.toFixed(2);
          if (newMarketPrice !== marketPrice) {
            setMarketPrice(newMarketPrice);
            calculatePercentageChange(r_pastMarketPrice, newMarketPrice)
          }
        };
      });
    }

    callAPIsAndPopulateState();
  }, [])

  return (
    <div className="relative shrink-0 bg-white rounded shadow flex py-2 items-center gap-6 px-5">
      <div className="flex">
        <div className="flex flex-col w-[120px]">
          <div className="font-medium tracking-tight text-primary hover:cursor-pointer hover:underline">{ticker}</div>
          <div className="font-light text-sm tracking-tight text-secondaryText truncate">{fullCompName ? fullCompName : <PlaceholderLoading shape="rect" width="120" height="20" />}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Market Price</div>
        <div className={`${marketPercentChangeIncrease ? "text-increase" : "text-decrease"}`}>{marketPrice ? marketPrice : <PlaceholderLoading shape="rect" width="79.82" height="20" />}</div>
      </div>
      <div className="flex flex-col">
        <div className="font-light text-sm tracking-tight text-secondaryText">Change</div>
        <div className={`${marketPercentChangeIncrease ? "text-increase" : "text-decrease"}`}>{marketPercentChange ? `${marketPercentChange}%` : <PlaceholderLoading shape="rect" width="54.03" height="20" />}</div>
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
  const handleInputChange = (e) => setTickerInput(e.target.value)

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
            <button className="bg-primary text-white rounded-2xl px-3 py-3`" type="submit">
              {watchListStatus === "loadingToAddTicker" ?
                <TailSpin
                  className="h-6 w-6 mx-auto"
                  stroke="white"
                  speed={0.75}
                /> :
                "Add"
              }
            </button>
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
    <div onClick={() => setEditIsActive(!editIsActive)} className={`h-[75px] ${editIsActive ? "bg-primary text-white" : "bg-white hover:text-primary"} rounded flex justify-center items-center shadow font-light hover:cursor-pointer`}>
      {editIsActive ? <p className="px-2">Submit</p> : <p className="w-[52px] text-center">Edit</p>}
    </div>
  )
}

const LoadingTickers = () => {
  return (
    <div className="flex gap-2 items-center text-primary pt-2">
      <TailSpin
        className="h-6 w-6 mx-auto"
        stroke="#3482F6"
        speed={0.75}
      />
      <div>Loading WatchList</div>
    </div>
  )
}

const ErrorLoadingTickers = () => {
  return (
    <div className="flex gap-2 items-center text-error pt-2">
      <div>Error Occured Loading WatchList</div>
    </div>
  )
}
export default WatchList