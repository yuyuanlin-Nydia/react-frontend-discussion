import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./QuestionConPage.module.css";
import QuestionDetails from "../layout/QuestionDetails";
import AnswerList from "../component/answer/AnswerList";

const dummy_data = {
  id: "q1",
  votes: 110,
  title: "How to??",
  content:
    "1.content-box 是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。 ",
  answers: 2,
};
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
  const questions = useSelector((state) => state.questions.items);
  const questionId = useParams().questionId;
  const navigate = useNavigate();

  const singleQuestion=questions.find((item)=>{ 
    return item.id==questionId
  })
  const goBackHandler = () => {
    navigate(-1);
  };
  return (
    <div className={classes.questionConContainter}>
      <div onClick={goBackHandler}>Go Back</div>

      <QuestionDetails questionData={singleQuestion} />
      <AnswerList answerData={dummy_data2} />
    </div>
  );
}

export default QuestionConPage;
