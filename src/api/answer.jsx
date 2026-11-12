import { request } from './client'

export const fetchAnswersApi = async (questionId, { params }) => await request(`/answers/${questionId}.json`, { params })
export const addAnswerApi = async (answerData, questionID) =>
  await request(`/answers/${questionID}.json`, {
    method: 'POST',
    body: JSON.stringify(answerData)
  })

// 使用 PATCH 只更新傳入的欄位，避免覆蓋 time、email 等原有資料
export const editAnswerApi = async ({ questionId, answerId, updatedAnswerData }) =>
  await request(`/answers/${questionId}/${answerId}.json`, {
    method: 'PATCH',
    body: JSON.stringify(updatedAnswerData)
  })

export const deleteAnswerApi = async (questionId, answerId) =>
  await request(`/answers/${questionId}/${answerId}.json`, {
    method: 'DELETE'
  })

// 留言串中的回覆存放於 /answers/{questionId}/{answerId}/replies/{replyId}
export const addReplyApi = async (replyData, questionId, answerId) =>
  await request(`/answers/${questionId}/${answerId}/replies.json`, {
    method: 'POST',
    body: JSON.stringify(replyData)
  })

export const editReplyApi = async ({ questionId, answerId, replyId, updatedReplyData }) =>
  await request(`/answers/${questionId}/${answerId}/replies/${replyId}.json`, {
    method: 'PATCH',
    body: JSON.stringify(updatedReplyData)
  })

export const deleteReplyApi = async (questionId, answerId, replyId) =>
  await request(`/answers/${questionId}/${answerId}/replies/${replyId}.json`, {
    method: 'DELETE'
  })
