import React from 'react'
// import QuestionCard from '../component/question/QuestionCard'
import PropTypes from 'prop-types'
import classes from './QuestionDetails.module.css'

QuestionDetails.propTypes = {
  questionData: PropTypes.object
}

function QuestionDetails (props) {
  const { title, description, votes } = props.questionData
  return (
    <div className={classes.questionDataCard}>
      <div className={classes.questionTitle}>{title}</div>
      <div className={classes.questionSubTitle}>
        <span>Viewed 36 times</span>
        <span>{votes} votes</span>
      </div>
      <div className={classes.questionDescription}>{description}</div>
      <div className={classes.questionTags}>
        <div className={classes.questionTag}>jQuery</div>
        <div className={classes.questionTag}>javascript
        </div>
      </div>

    </div>
  )
}

export default QuestionDetails
