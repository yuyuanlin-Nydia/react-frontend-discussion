import React, { Fragment } from 'react'
import QuestionCard from '../component/question/QuestionCard'
import PropTypes from 'prop-types'

QuestionDetails.propTypes = {
  questionData: PropTypes.object
}

function QuestionDetails (props) {
  return (
    <Fragment>
      <QuestionCard questionData={props.questionData}/>
    </Fragment>
  )
}

export default QuestionDetails
