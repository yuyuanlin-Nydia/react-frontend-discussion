import { commentAction } from './comment-slice'

const firebaseDomain = 'https://frontend-discussion-default-rtdb.firebaseio.com'

export const fetchCommentData = (paramsQuestionId) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${firebaseDomain}/answers/${paramsQuestionId}.json?orderBy="time"`)
      const data = await response.json()
      return data
    }
    try {
      const commentData = await fetchData()
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
      dispatch(commentAction.getComments(transformedComment || []))
    } catch (error) {
      console.log(error)
    }
  }
}
export async function addAnswer (commentData, questionID) {
  const response = await fetch(
    `${firebaseDomain}/answers/${questionID}.json`,
    {
      method: 'POST',
      body: JSON.stringify(commentData),
      'Content-Type': 'application/json'
    }
  )
  const data = await response.json()
  console.log(data)
  alert('已成功新增回覆!')
  fetchCommentData(questionID)
}
