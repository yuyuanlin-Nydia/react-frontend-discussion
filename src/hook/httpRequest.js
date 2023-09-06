import { useState, useEffect } from 'react'
const httpRequest = () => {
  const [loading, setLoading] = false
  setLoading(true)
  fetch('https://frontend-discussion-default-rtdb.firebaseio.com/question.json')
  setLoading(false)
  return { loading } = data
}
export default httpRequest
