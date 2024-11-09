import React, { Fragment } from 'react'
import classes from './AnswerCard.module.css'
import formatDate from '../../lib/dateFormat'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import { mdiAccount, mdiCalendarRange } from '@mdi/js'

AnswerCard.propTypes = {
  answerData: PropTypes.array
}

function AnswerCard (props) {
  const { id, author, answer, time } = props.answerData
  return (
    <Fragment>
      <div key={id} className={classes.answerCard}>
        <p className={classes.answer}>{answer}</p>
        <div className={classes.answerInfo}>
          <div className={classes.answerAuthor}>
            <Icon path={mdiAccount} size={0.8} />
            <span>{author}</span>
          </div>
          <div className={classes.answerDate}>
            <Icon path={mdiCalendarRange} size={0.8} />
            <span>{formatDate(new Date(time))}</span>
          </div>
        </div>

      </div>
    </Fragment>
  )
}

export default AnswerCard
