import { answerAction } from './answer-slice'
import { fetchAnswersApi, addAnswerApi, editAnswerApi, deleteAnswerApi } from '../api/answer'
import { addAnswerCount } from './question-action'

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

export async function editAnswer (questionId, answerId, answer) {
  await editAnswerApi({
    questionId,
    answerId,
    updatedAnswerData: { answer, updateTime: new Date() }
  })
}

// 刪除回答並同步將問題的回答數量 -1
export async function deleteAnswer (questionId, answerId) {
  await deleteAnswerApi(questionId, answerId)
  await addAnswerCount(questionId, -1)
}
