import { createSlice } from '@reduxjs/toolkit'

const initialCommentState = { items: [] }
const commentSlice = createSlice({
  name: 'comments',
  initialState: initialCommentState,
  reducers: {
    getComments (state, action) {
      state.items = action.payload
    }
  }
})
export default commentSlice.reducer
export const commentAction = commentSlice.actions
