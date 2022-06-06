import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./ModalWrapper.module.css";
function ModalWrapper(props) {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div
          onClick={props.onClickModal}
          className={classes.modalWrapper}
        ></div>,
        document.getElementById("modal-root")
      )}
    </Fragment>
  );
}

export default ModalWrapper;
