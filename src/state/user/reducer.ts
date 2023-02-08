import { createSlice } from '@reduxjs/toolkit'

import { SerializedPair, SerializedToken } from './types'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action

  matchesDarkMode: boolean // whether the dark mode media query matches

  userDarkMode: boolean | null // the user's choice for dark mode or light mode

  timestamp: number
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  matchesDarkMode: false,
  userDarkMode: null,

  timestamp: currentTimestamp(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDarkMode(state, action) {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    },
    updateMatchesDarkMode(state, action) {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    },
  },
})

export const { updateUserDarkMode } = userSlice.actions
export default userSlice.reducer
