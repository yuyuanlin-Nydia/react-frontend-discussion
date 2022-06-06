import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleQuestion } from "../store/question-action";
import classes from "./QuestionConPage.module.css";
import QuestionDetails from "../layout/QuestionDetails";
import AnswerList from "../component/answer/AnswerList";

const dummy_data2 = [
  {
    id: "a1",
    author: "Ell Mask",
    account: "@mask25635",
    answer:
      "會回傳一個包含兩個值的 array，第一個值是 state、第二個值是用來更新 state 的函式,會回傳一個包含一個值是 state、第二個值是用來更新 state 的函式",
  },
  {
    id: "a2",
    author: "Scott Lowie",
    account: "@scott68795",
    answer:
      "以上程式碼就代表 appleCount這個變數的初始值是 1 ，只有用 setAppleCount這個更新函式更新 appleCount 才會觸發 re-render",
  },
];
function QuestionConPage() {
  const singleQuestion = useSelector((state) => state.questions.singleQuestionData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paramsQuestionId = useParams().questionId;
  useEffect(() => {
    dispatch(fetchSingleQuestion(paramsQuestionId));
  }, []);

  const goBackHandler = () => {
    navigate(-1);
  };
  return (
    <div className={classes.questionConContainter}>
      <div className={classes.goBackBtn} onClick={goBackHandler}>
        Go Back
      </div>

      <QuestionDetails questionData={singleQuestion} />
      <AnswerList answerData={dummy_data2} />
    </div>
  );
}

export default QuestionConPage;
