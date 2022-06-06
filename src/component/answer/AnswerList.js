import React, { useEffect, useRef } from "react";
import classes from "./AnswerList.module.css";
import { useParams } from "react-router-dom";
import { fetchCommentData } from "../../store/comment-action";
import { useDispatch, useSelector } from "react-redux";
import AnswerCard from "./AnswerCard";
import Button from "../../UI/Button";

function AnswerList(props) {
  const { answerData } = props;
  console.log(answerData);
  const dispatch = useDispatch();
  const paramsQuestionId = useParams().questionId;
  const answerData2 = useSelector((state) => state.comments.items.comments);
  console.log(answerData2);
  useEffect(() => {
    dispatch(fetchCommentData(paramsQuestionId));
    console.log("success");
  }, [dispatch]);

  const commentTextRef = useRef("");
  const submitCommentHandler = () => {
    console.log(commentTextRef.current.value);
  };
  return (
    <div className={classes.answerConContainer}>
      <h3>4 Comments</h3>
      {answerData.map((answer) => (
        <AnswerCard answerData={answer} key={answer.id} />
      ))}
      <h5>你的回覆</h5>
      <textarea ref={commentTextRef} />
      <Button clickEvent={submitCommentHandler}>確認送出</Button>
    </div>
  );
}

export default AnswerList;
