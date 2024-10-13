import React, { Fragment } from 'react'
import classes from './AnswerCard.module.css'
import formatDate from '../../lib/dateFormat'
import PropTypes from 'prop-types'

AnswerCard.propTypes = {
  answerData: PropTypes.array
}

function AnswerCard (props) {
  const { id, author, account, answer, time } = props.answerData
  return (
    <Fragment>
      <div key={id} className={classes.answerCard}>
        <h6>{author}</h6>
        <div className={classes.dataBox}>
          <img src="https://img.icons8.com/windows/32/000000/user.png" alt='user' />
          <span>{account}</span>
        </div>
        <div className={classes.dataBox}>
          <img src="https://img.icons8.com/ios-glyphs/30/000000/calendar-13.png" alt='calendar'/>
          <span>{formatDate(new Date(time))}</span>
        </div>
        <p className={classes.answer}>{answer}</p>
      </div>
    </Fragment>
  )
}

export default AnswerCard
