
import classes from "./QuestionCard.module.css";

function QuestionCard(props) { 
 
  const { votes, title, description, answers } = props.questionData;
  return (
    <div className={classes.singleDiscussion}>
      <div className={classes.voteNum}>
        <p>
          <img
            className={classes.arrowUpIcon}
            src="https://img.icons8.com/ios-glyphs/30/000000/chevron-up.png"
            alt=""
          />
          {votes}
        </p>
      </div>
      <div className={classes.discussionContent}>
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
      <div className={classes.comentNum}>
        <img
          className={classes.msgIcon}
          src="https://img.icons8.com/fluency/48/000000/topic.png"
          alt=""
        />
        <span>{answers}</span>
      </div>
    </div>
  );
};

export default QuestionCard;
