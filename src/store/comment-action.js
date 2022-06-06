import { commentAction } from "./comment-slice";
const firebaseDomain =
  "https://frontend-discussion-default-rtdb.firebaseio.com";
export const fetchCommentData = (paramsQuestionId) => {
    console.log(paramsQuestionId)
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${firebaseDomain}/comments.json`);
      const data = await response.json();
      return data;
    };
    try {
      const commentData = await fetchData();
      console.log(commentData[paramsQuestionId]);
      const loadedData={
          id:paramsQuestionId,
          comments:{...commentData[paramsQuestionId]}
        }
        console.log(loadedData);
      dispatch(commentAction.getComments(loadedData||[]))
    } catch(error) {
        console.log(error)
    }
  };
};
export async function addComment(commentData) {
    const response = await fetch(`${firebaseDomain}/questions.json`, {
      method: "POST",
      body: JSON.stringify(commentData),
      "Content-Type": "application/json",
    });
    const data = await response.json();
    console.log(data);
    alert("已成功新增回應!");
  }
