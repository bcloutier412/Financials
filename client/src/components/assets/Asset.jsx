import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import quoteService from '../../api/quoteService'

import PlaceholderLoading from 'react-placeholder-loading'
import { createChart, ColorType } from 'lightweight-charts';
import { TailSpin } from "react-loading-icons";

const Asset = () => {
  const { ticker } = useParams();

  useEffect(() => {
    const requestStockDataAndChartData = async (ticker) => {
      const api_response = await quoteService.getQuoteChartAndSearch(ticker);
      console.log(api_response)
    }
    console.log(ticker)
    requestStockDataAndChartData(ticker)
  }, [ticker])
  return (
    <div className="bg-primaryBackground h-full lg:pt-[2px] overflow-scroll">
      <div className="container mx-auto flex lg:flex-row flex-col lg:gap-4">
        <StockInfo_Chart ticker={ticker} />
        <BuySell />
      </div>
    </div>
  )
}

const StockInfo_Chart = ({ ticker }) => {
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
      setIsLoading(true);
      chart.current.chartElement().style.display = "none";
    }
  }, [ticker])

  /**
   * Render Chart and Update date when the ticker changes
   */
  useEffect(() => {
    const populateStateAndChartData = async (ticker) => {
      // Render chart data from server
      const response = await quoteService.getQuoteChartAndSearch(ticker);
      const tempChartData = [];

      for (let i = 0; i < response.data.data.chart.timestamp.length; i++) {
        const candle = {
          open: response.data.data.chart.indicators.quote[0].open[i],
          high: response.data.data.chart.indicators.quote[0].high[i],
          low: response.data.data.chart.indicators.quote[0].low[i],
          close: response.data.data.chart.indicators.quote[0].close[i],
          time: response.data.data.chart.timestamp[i]
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
          rightPriceScale: {
            autoScale: true,
            borderVisible: false
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true
          },
          height: chartContainerWrapper.current.clientHeight,
          width: chartContainerWrapper.current.clientWidth
        })
        chart.current.timeScale().fitContent()
        dataSeries.current = chart.current.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });
      }

      // Reset the visibility of the chart
      // Populate chart with data
      setIsLoading(false)
      dataSeries.current.setData(tempChartData);
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
    <div className="grow bg-white rounded shadow-component">
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
      <div className="lg:h-[700px] h-[300px]" ref={chartContainerWrapper}>
        {isLoading && <div className="h-full flex justify-center items-center">
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
    <div className="shrink-0 w-1/5 h-fit bg-white rounded shadow-component">
      <header className="p-5">
        <h1 className="text-lg">Make a trade</h1>
      </header>
    </div>
  )
}
export default Asset