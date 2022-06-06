import React from "react";
import classes from "./Filter.module.css";
import Button from "../UI/Button";
function Filter(props) {
  return (
    <div className={classes.topLine}>
      <h5>6 Suggestions</h5>
      <div>
        <span className={classes.filteredTxt}>Sort by : </span>
        <select name="" id="">
          <option value="">Most Comments</option>
          <option value="">Latest Update</option>
          <option value="">Most UpVotes</option>
        </select>
      </div>
      <Button classBtn={classes.addQuestionBtn}  clickEvent={props.onClickModal}>+Ask Question</Button>
    </div>
  );
}

export default Filter;
