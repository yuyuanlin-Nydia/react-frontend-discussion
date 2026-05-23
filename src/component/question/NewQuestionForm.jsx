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
      views: 0,
      time: new Date()
    }
    addQuestion(data)
    props.onClickModal()
    dispatch(fetchQuestions())
  }
  return (
    <Modal>
      <form className={classes.newQuestionForm} onSubmit={submitHandler}>
        <h6 className={classes.title}>發問</h6>
        <div className={classes.formContent}>
          <div className={classes.eachInput}>
            <label>標題:</label>
            <input type="text" ref={titleRef} />
          </div>
          <div className={classes.eachInput}>
            <label>描述:</label>
            <textarea type="text" ref={descriptionRef} />
          </div>
        </div>
        <div className={classes.formBtns}>
          <Button type="submit" classBtn={classes.submit}>
            送出
          </Button>
          <Button clickEvent={props.onClickModal} classBtn={classes.leave}>
            取消
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default NewQuestionForm
