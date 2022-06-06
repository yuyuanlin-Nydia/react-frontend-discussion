import React, { useRef } from "react";
import { addQuestion } from "../../store/question-action";
import { fetchQuestionData } from "../../store/question-action";
import { useDispatch } from "react-redux";
import classes from "./NewQuestionForm.module.css";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
function NewQuestionForm(props) {
  console.log();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      votes: 0,
      answers: 0,
    };
    addQuestion(data);
    props.onClickModal();
    dispatch(fetchQuestionData());
  };
  return (
    <Modal>
      <form className={classes.newQuestionForm} onSubmit={submitHandler}>
        <h4>Ask Question</h4>
        <div className={classes.formContent}>
          <div className={classes.eachInput}>
            <label>Title:</label>
            <input type="text" ref={titleRef} />
          </div>
          <div className={classes.eachInput}>
            <label>Description:</label>
            <textarea type="text" ref={descriptionRef} />
          </div>
        </div>
        <div className={classes.formBtns}>
          <Button type="submit">Send</Button>
          <Button clickEvent={props.onClickModal}>Leave</Button>
        </div>
      </form>
    </Modal>
  );
}

export default NewQuestionForm;
