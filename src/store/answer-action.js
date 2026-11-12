import { answerAction } from './answer-slice'
import {
  fetchAnswersApi, addAnswerApi, editAnswerApi, deleteAnswerApi,
  addReplyApi, editReplyApi, deleteReplyApi
} from '../api/answer'
import { updateQuestionAnswerCountApi } from '../api/question'

// 回答本身已新增／刪除成功，但問題的回答數量未能同步更新
export class AnswerCountSyncError extends Error {
  constructor () {
    super('回答數量更新失敗')
    this.code = 'ANSWER_COUNT_SYNC'
  }
}

// 更新回答數量，失敗時重試一次，仍失敗則拋出 AnswerCountSyncError
async function syncAnswerCount (questionId, delta) {
  try {
    await updateQuestionAnswerCountApi(questionId, delta)
  } catch (firstError) {
    try {
      await updateQuestionAnswerCountApi(questionId, delta)
    } catch (retryError) {
      throw new AnswerCountSyncError()
    }
  }
}

const timeOf = (item) => new Date(item.time || item.createTime || 0).getTime()

// 將 Firebase 的 { pushKey: {...} } 回覆物件轉成依時間由舊到新排序的陣列
export function transformReplies (replies) {
  if (!replies) return []
  return Object.keys(replies)
    .map((key) => ({ id: key, ...replies[key] }))
    .sort((a, b) => timeOf(a) - timeOf(b))
}

export const fetchAnswerData = (paramsQuestionId) => {
  return async (dispatch) => {
    try {
      const answerData = await fetchAnswersApi(paramsQuestionId, { params: { orderBy: 'time' } })
      const transformedAnswer = []
      for (const key in answerData) {
        const obj = {
          id: key,
          ...answerData[key],
          replies: transformReplies(answerData[key].replies)
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

// 新增回答並將問題的回答數量 +1
export async function addAnswer (answerData, questionId) {
  await addAnswerApi(answerData, questionId)
  await syncAnswerCount(questionId, 1)
}

export async function editAnswer (questionId, answerId, answer) {
  await editAnswerApi({
    questionId,
    answerId,
    updatedAnswerData: { answer, updateTime: new Date() }
  })
}

// 刪除回答並將問題的回答數量 -1（其下的回覆會一併刪除）
export async function deleteAnswer (questionId, answerId) {
  await deleteAnswerApi(questionId, answerId)
  await syncAnswerCount(questionId, -1)
}

// 留言串中的回覆不計入問題的回答數量
export async function addReply (replyData, questionId, answerId) {
  await addReplyApi(replyData, questionId, answerId)
}

export async function editReply (questionId, answerId, replyId, answer) {
  await editReplyApi({
    questionId,
    answerId,
    replyId,
    updatedReplyData: { answer, updateTime: new Date() }
  })
}

export async function deleteReply (questionId, answerId, replyId) {
  await deleteReplyApi(questionId, answerId, replyId)
}
