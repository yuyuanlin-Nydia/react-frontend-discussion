import React, { Fragment } from 'react'
import ModalWrapper from '../UI/ModalWrapper'
import NewQuestionForm from '../component/question/NewQuestionForm'
import PropTypes from 'prop-types'

AddQuestionModal.propTypes = {
  onClickModal: PropTypes.func
}

function AddQuestionModal (props) {
  return (
    <Fragment>
        <NewQuestionForm onClickModal={props.onClickModal} />,
        <ModalWrapper onClickModal={props.onClickModal} />,
    </Fragment>
  )
}

export default AddQuestionModal
