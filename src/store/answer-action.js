import { answerAction } from './answer-slice'
import { fetchAnswersApi, addAnswerApi } from '../api/answer'

export const fetchAnswerData = (paramsQuestionId) => {
  return async (dispatch) => {
    try {
      const answerData = await fetchAnswersApi(paramsQuestionId, { params: { orderBy: 'time' } })
      const transformedAnswer = []
      for (const key in answerData) {
        const obj = {
          id: key,
          ...answerData[key]
        }
        transformedAnswer.push(obj)
      }
      // 評論由時間進到遠進行排序
      transformedAnswer.reverse()
      dispatch(answerAction.setAnswers(transformedAnswer || []))
    } catch (error) {
      console.log(error)
    }
  }
}
export async function addAnswer (anserData, questionID) {
  await addAnswerApi(anserData, questionID)
}
