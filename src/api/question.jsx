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

// delta 為正數時增加、負數時減少回答數量
export const updateQuestionAnswerCountApi = async (questionID, delta = 1) => {
  return await request(`/questions/${questionID}.json`, {
    method: 'PATCH',
    body: JSON.stringify({
      answers: { '.sv': { increment: delta } }
    })
  })
}
export const updateQuestionViewCountApi = async (questionID) => {
  return await request(`/questions/${questionID}.json`, {
    method: 'PATCH',
    auth: false, // 未登入的訪客也會累計瀏覽次數
    body: JSON.stringify({
      // .sv 代表 Server Value（伺服器變數），這行指令會讓 Firebase 伺服器在後端自動 +1
      views: { '.sv': { increment: 1 } }
    })
  })
}
