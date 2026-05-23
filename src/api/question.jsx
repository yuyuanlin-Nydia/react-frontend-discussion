import { request } from './client'

export const fetchQuestionsApi = async (params) =>
  await request('/questions.json', { params })

export const fetchSingleQuestionApi = async (questionId) =>
  await request(`/questions/${questionId}.json`)

export const addQuestionApi = async (questionData) =>
  await request('/questions.json', {
    method: 'POST',
    body: JSON.stringify(questionData)
  })

export const updateQuestionAnswerCountApi = async (questionID, { params }) => {
  return await request(`/questions/${questionID}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ answers: params.answerCount })
  })
}
