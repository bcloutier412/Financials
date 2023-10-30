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
        state.status = 'loading'
      })
      .addCase(fetchUserWatchList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserWatchList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

    builder
      .addCase(addToUserWatchList.pending, (state) => {
        state.error = null
        state.status = 'loading'
      })
      .addCase(addToUserWatchList.fulfilled, (state, action) => {
        const { ticker } = action.payload;
        console.log(ticker)
        state.status = 'succeeded';
        state.data.push(ticker)
        state.error = null;
      })
      .addCase(addToUserWatchList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

  }
})

export const selectUserWatchList = state => state.watchList.data

export const selectUserWatchListStatus = state => state.watchList.status

export default watchListSlice.reducer