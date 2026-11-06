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
