import { questionAction } from './question-slice'
const firebaseDomain =
  'https://frontend-discussion-default-rtdb.firebaseio.com'
export const fetchQuestionData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${firebaseDomain}/questions.json`)
      const data = await response.json()
      return data
    }
    try {
      const questionData = await fetchData()
      const transformedQuotes = []

      for (const key in questionData) {
        const quoteObj = {
          id: key,
          ...questionData[key]
        }
        transformedQuotes.push(quoteObj)
      }
      dispatch(questionAction.getQuestionsData(transformedQuotes || []))
      if (!localStorage.getItem('myQuestionData')) {
        localStorage.setItem('myQuestionData', questionData)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
export const fetchSingleQuestion = (questionId) => {
  return async (dispatch) => {
    const response = await fetch(
      `${firebaseDomain}/questions/${questionId}.json`
    )
    const data = await response.json()
    const loadedQuestion = {
      id: questionId,
      ...data
    }
    dispatch(questionAction.getSingleQuestionData(loadedQuestion || []))
  }
}
export async function addQuestion (questionData) {
  const response = await fetch(`${firebaseDomain}/questions.json`, {
    method: 'POST',
    body: JSON.stringify(questionData),
    'Content-Type': 'application/json'
  })
  const data = await response.json()
  console.log(data)
  alert('已成功發問!')
}
