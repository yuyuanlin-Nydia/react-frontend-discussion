import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchQuestionData } from '../../store/question-action'
import { NavLink } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import classes from './QuestionList.module.css'

function QuestionList () {
  const dispatch = useDispatch()
  const questionData = useSelector((state) => state.questions.items)
  useEffect(() => {
    dispatch(fetchQuestionData())
  }, [dispatch])

  return (
    <div className={classes.questionList}>
      {questionData &&
        questionData.map((question) => (
          <NavLink to={`question-details/${question.id}`} key={question.id}>
            <QuestionCard questionData={question} />
          </NavLink>
        ))}
    </div>
  )
}

export default QuestionList
