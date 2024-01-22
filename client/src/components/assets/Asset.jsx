import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import quoteService from '../../api/quoteService'

import PlaceholderLoading from 'react-placeholder-loading'
import { createChart, ColorType } from 'lightweight-charts';
import { TailSpin } from "react-loading-icons";

const Asset = () => {
  const { ticker } = useParams();

  return (
    <div className="bg-primaryBackground h-full lg:pt-[2px] overflow-scroll flex flex-col lg:gap-2">
      <div className="container mx-auto flex lg:flex-row flex-col lg:gap-4">
        <StockChart ticker={ticker} />
        <BuySell />
      </div>
      <div className="container mx-auto">
        <StockInfo ticker={ticker} />
      </div>
    </div>
  )
}

const StockChart = ({ ticker }) => {
  const [isLoading, setIsLoading] = useState(true);
  const chartContainerRef = useRef();
  const chartContainerWrapper = useRef();
  let chart = useRef();
  let dataSeries = useRef();

  /** 
   * Hide chart upon ticker change
   */
  useEffect(() => {
    if (chart.current) {
      chart.current.chartElement().style.display = "none";
      setIsLoading(true);
    }
  }, [ticker])

  /**
   * Render Chart and Update date when the ticker changes
   */
  useEffect(() => {
    const populateStateAndChartData = async (ticker) => {
      // Render chart data from server
      const response = await quoteService.getChartData(ticker);
      const tempChartData = [];

      for (let i = 0; i < response.data.data.timestamp.length; i++) {
        const candle = {
          open: response.data.data.indicators.quote[0].open[i] || undefined,
          high: response.data.data.indicators.quote[0].high[i] || undefined,
          low: response.data.data.indicators.quote[0].low[i] || undefined,
          close: response.data.data.indicators.quote[0].close[i] || undefined,
          time: response.data.data.timestamp[i]
        }
        tempChartData.push(candle)
      }

      // Create chart
      if (!chart.current) {
        chart.current = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'white' },
            textColor: 'rgba(0,0,0,.6)',
          },
          grid: {
            horzLines: {
              color: '#eee'
            }
          },
          rightPriceScale: {
            autoScale: true,
            borderVisible: false
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true,
          },
          height: chartContainerWrapper.current.clientHeight,
          width: chartContainerWrapper.current.clientWidth
        })
        chart.current.timeScale().fitContent()
        dataSeries.current = chart.current.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });
      }

      // Reset the visibility of the chart
      // Populate chart with data
      dataSeries.current.setData(tempChartData);
      chart.current.timeScale().fitContent();
      chart.current.applyOptions({
        rightPriceScale: {
          autoScale: true, // Reset the right price scale to its default state
        },
      });
      setIsLoading(false)
      chart.current.chartElement().style.display = "block"
    }
    populateStateAndChartData(ticker)
    const handleResize = () => {
      chart.current.applyOptions({ width: chartContainerWrapper.current.clientWidth });
      chart.current.applyOptions({ height: chartContainerWrapper.current.clientHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ticker])

  return (
    <div className="grow bg-white lg:rounded lg:shadow-component">
      {/** HEADER **/}
      <header className="p-5">
        <h1 className="text-lg">
          {ticker}
        </h1>
        <h2 className="text-sm text-secondaryText">
        </h2>
      </header>
      <div className="h-[1px] bg-secondaryOutline mx-5"></div>

      {/** CHART **/}
      <div className="relative lg:h-[700px] h-[300px]" ref={chartContainerWrapper}>
        {isLoading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-full flex justify-center items-center">
          <TailSpin
            className="h-12 w-12 mx-auto"
            stroke="#3482F6"
            speed={0.75}
          />
        </div>}
        <div ref={chartContainerRef}></div>
      </div>
    </div>
  )
}

const BuySell = () => {
  return (
    <div className="shrink-0 lg:w-1/5 h-fit bg-white lg:rounded lg:shadow-component">
      <header className="p-5">
        <h1 className="text-lg">Make a trade</h1>
      </header>
    </div>
  )
}

const StockInfo = ({ ticker }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState(undefined);

  useEffect(() => {
    const populateStockInfo = async () => {
      const response = await quoteService.getStockInfo(ticker);
      const another_response = await quoteService.getOptionsData(ticker);
      console.log(another_response)
      console.log(response)
      // console.log(response.data.quote.quotes[0])
      setStockInfo(response.data.quote.quotes[0])
    }
    populateStockInfo();
  }, [ticker])

  return (
    <div className="grid grid-cols-3 p-5 bg-white lg:rounded lg:shadow-component">
      <div>HELELELLELELLE</div>
      <div>HERE IS ANOTHER ONE</div>
      <div>LMAO</div>
    </div>
  )
}
export default Asset