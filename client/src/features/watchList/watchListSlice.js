import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../api/userService'

const initialState = {
  status: 'idle',
  data: [],
  error: null
};

export const fetchUserWatchList = createAsyncThunk('watchList/fetchUserWatchList', async () => {
  const response = await userService.getUserWatchlist();
  return response.data
})

export const addToUserWatchList = createAsyncThunk('watchList/addToUserWatchList', async (ticker) => {
  const response = await userService.postToUserWatchList(ticker);
  return response.data
})

const watchListSlice = createSlice({
  name: 'watchList',
  initialState,
  reducers: {
    resetError(state) {
      console.log("reset error")
      state.error = "";
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserWatchList.pending, (state) => {
        state.error = null
        state.status = 'loadingTickers'
      })
      .addCase(fetchUserWatchList.fulfilled, (state, action) => {
        const { watchList } = action.payload;
        state.status = 'succeededLoadingTickers';
        state.data = watchList;
        state.error = null;
      })
      .addCase(fetchUserWatchList.rejected, (state, action) => {
        state.status = 'failedLoadingTickers'
        state.error = action.error.message
      })

    builder
      .addCase(addToUserWatchList.pending, (state) => {
        state.error = null
        state.status = 'loadingToAddTicker'
      })
      .addCase(addToUserWatchList.fulfilled, (state, action) => {
        const { ticker } = action.payload;
        state.status = 'succeededToAddTicker';
        state.data.push(ticker)
        state.error = null;
      })
      .addCase(addToUserWatchList.rejected, (state, action) => {
        state.status = 'failedToAddTicker'
        state.error = action.error.message
      })

  }
})

export const { resetError } = watchListSlice.actions

export const selectUserWatchList = state => state.watchList.data

export const selectUserWatchListStatus = state => state.watchList.status

export const selectUserWatchListError = state => state.watchList.error

export default watchListSlice.reducer