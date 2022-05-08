import React, { Fragment } from "react";
import classes from "./AnswerCard.module.css";

function AnswerCard(props) {
  const { id, author, account, answer } = props.answerData;
  return (
    <Fragment>
      
      <div key={id} className={classes.answerCard}>
        <h5>{author}</h5>
        <p className={classes.account}>{account}</p>
        <p className={classes.answer}>{answer}</p>
      </div>
    </Fragment>
  );
}

export default AnswerCard;
