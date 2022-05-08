import React, { Fragment } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import NewQuestionForm from "../component/question/NewQuestionForm";

function AddQuestionModal(props) {
  return (
    <Fragment>
      <ModalWrapper onClickModal={props.onClickModal  }/>
      <NewQuestionForm onClickModal={props.onClickModal  }/>
    </Fragment>
  );
}

export default AddQuestionModal;
