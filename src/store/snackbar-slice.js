import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  message: '',
  icon: null, // 可傳入 mdi path
  duration: 3000,
  bgColor: '#2fd420cd',
  showCloseIcon: false,
  top: false,
  center: true,
  bottom: false
}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar (state, action) {
      const { message, icon, duration, bgColor, showCloseIcon, top, center, bottom } = action.payload
      state.isOpen = true
      state.message = message || ''
      state.icon = icon || null
      state.duration = duration !== undefined ? duration : 3000
      state.bgColor = bgColor || '#2fd420cd'
      state.showCloseIcon = showCloseIcon || false
      state.top = top || false
      state.center = center || true
      state.bottom = bottom || false
    },
    closeSnackbar (state) {
      state.isOpen = false
    }
  }
})

export const snackbarActions = snackbarSlice.actions
export default snackbarSlice.reducer
