import { questionAction } from './question-slice'
import { fetchQuestionsApi, 
  fetchSingleQuestionApi, 
  addQuestionApi,
  updateQuestionAnswerCountApi
} from '../api/question'

export const fetchQuestions = (params) => {
  return async (dispatch) => {
    try {
      const questionData = await fetchQuestionsApi(params)
      const transformedQuotes = []

      for (const key in questionData) {
        const quoteObj = {
          id: key,
          ...questionData[key]
        }
        transformedQuotes.push(quoteObj)
      }
      dispatch(questionAction.setQuestions(transformedQuotes || []))
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
    const data = await fetchSingleQuestionApi(questionId)
    const loadedQuestion = {
      id: questionId,
      ...data
    }
    dispatch(questionAction.setSingleQuestion(loadedQuestion || []))
  }
}
export async function addQuestion (questionData) {
  await addQuestionApi(questionData)
  alert('已成功發問!')
}

// 更新問題的回答數量
export const updateQuestionAnswerCount = async (questionID, { answerCount }) => {
  try {
    await updateQuestionAnswerCountApi(questionID, { params: { answerCount } })
  } catch (error) {
    console.log(error)
  }
}

