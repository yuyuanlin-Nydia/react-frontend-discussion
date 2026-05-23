import { request } from './client'

export const fetchAnswersApi = async (questionId, { params }) => await request(`/answers/${questionId}.json`, { params })
export const addAnswerApi = async (answerData, questionID) =>
  await request(`/answers/${questionID}.json`, {
    method: 'POST',
    body: JSON.stringify(answerData)
  })
