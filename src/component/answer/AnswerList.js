import React from "react";
import classes from "./AnswerList.module.css";

import AnswerCard from "./AnswerCard";

function AnswerList(props) {
  const { answerData } = props;
  return (
    <div className={classes.answerConContainer}>
      <h3>4 Comments</h3>
      {answerData.map((answer) => (
        <AnswerCard answerData={answer} key={answer.id} />
      ))}
    </div>
  );
}

export default AnswerList;
