import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../features/user/userSlice'
import watchListReducer from '../features/watchList/watchListSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    watchList: watchListReducer
  }
})