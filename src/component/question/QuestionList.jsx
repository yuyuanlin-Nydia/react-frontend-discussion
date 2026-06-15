import React from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import classes from './QuestionList.module.css'
import PropTypes from 'prop-types'
import { addViewCount } from '../../store/question-action'

QuestionList.propTypes = {
  questionList: PropTypes.array,
  isLoading: PropTypes.bool
}
function QuestionList (props) {
  const { questionList, isLoading } = props
  const navigate = useNavigate()
  const addViewCountHandler = async (questionId) => {
    navigate(`/question/question-details/${questionId}`)
    await addViewCount(questionId)
  }

  return (
    <div className={classes.questionList}>
      {isLoading
        ? (
         <div className={classes.loadingText}>載入中...</div>)
        : questionList.length > 0
          ? (
              questionList.map((question) => (
          <div key={question.id} onClick={() => addViewCountHandler(question.id)}>
            <QuestionCard questionData={question} />
          </div>
              )))
          : (
        <div className={classes.noDataText}>沒有符合條件的問題</div>)}
    </div>
  )
}

export default QuestionList
