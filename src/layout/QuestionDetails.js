import React, { Fragment } from "react";
import classes from "./QuestionDetails.module.css";

import QuestionCard from "../component/question/QuestionCard";
function QuestionDetails(props) {
  return (
    <Fragment>
      <QuestionCard questionData={props.questionData}/>
     
    </Fragment>
  );
}

export default QuestionDetails;
