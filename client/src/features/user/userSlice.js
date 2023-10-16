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

export const loginUser = createAsyncThunk('user/loginUser', async (loginInfo) => {
  const response = await userService.loginUser(loginInfo);
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
        state.error = null
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { name, username } = action.payload
        state.status = 'succeeded'
        state.name = name;
        state.username = username
        state.error = null
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed'
      })

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { name, username } = action.payload.user
        state.status = 'succeeded'
        state.name = name;
        state.username = username
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const selectUserStatus = state => state.user.status

export const selectUserError = state => state.user.error

export default userSlice.reducer