import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../api/userService'

const initialState = {
  status: 'idle',
  name: null,
  username: null,
  error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await userService.getUserInfo();
  return response.data
})
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state) => {
        console.log('setting to loading')
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log('succeeded')
        const { name, username } = action.payload
        state.status = 'succeeded'
        state.name = name;
        state.username = username
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log('userfailed')
        state.status = 'failed'
        console.log(action)
      })
  }
})

export const selectUserStatus = state => state.user.status

export default userSlice.reducer