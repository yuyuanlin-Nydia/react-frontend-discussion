import { commentAction } from './comment-slice'
import { fetchAnswersApi, addAnswerApi } from '../api/answer'

export const fetchCommentData = (paramsQuestionId) => {
  return async (dispatch) => {
    try {
      const commentData = await fetchAnswersApi(paramsQuestionId, { params: { orderBy: 'time' } })
      const transformedComment = []
      for (const key in commentData) {
        const obj = {
          id: key,
          ...commentData[key]
        }
        transformedComment.push(obj)
      }
      // 評論由時間進到遠進行排序
      transformedComment.reverse()
      dispatch(commentAction.setComments(transformedComment || []))
    } catch (error) {
      console.log(error)
    }
  }
}
export async function addAnswer (commentData, questionID) {
  await addAnswerApi(commentData, questionID)
  alert('已成功新增回覆!')
}
