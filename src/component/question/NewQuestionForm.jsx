import React, { useRef } from 'react'
import { addQuestion, fetchQuestions } from '../../store/question-action'
import { useDispatch } from 'react-redux'
import classes from './NewQuestionForm.module.css'
import Modal from '../../UI/Modal'
import Button from '../../UI/Button'
import PropTypes from 'prop-types'

NewQuestionForm.propTypes = {
  onClickModal: PropTypes.func
}

function NewQuestionForm (props) {
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const dispatch = useDispatch()
  const submitHandler = (e) => {
    e.preventDefault()
    const data = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      votes: 0,
      answers: 0,
      views: 0
    }
    addQuestion(data)
    props.onClickModal()
    dispatch(fetchQuestions())
  }
  return (
    <Modal>
      <form className={classes.newQuestionForm} onSubmit={submitHandler}>
        <h6 className={classes.title}>Ask Question</h6>
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
          <Button type="submit" classBtn={classes.submit}>
            Submit
          </Button>
          <Button clickEvent={props.onClickModal} classBtn={classes.leave}>
            Leave
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default NewQuestionForm
