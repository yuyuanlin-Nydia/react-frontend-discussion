import classes from './QuestionCard.module.css'
import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import { mdiThumbUpOutline, mdiForumOutline, mdiEyeOutline } from '@mdi/js'

QuestionCard.propTypes = {
  questionData: PropTypes.object
}

function QuestionCard (props) {
  const { votes, title, description, answers, views } = props.questionData
  return (
    <div className={classes.singleDiscussion}>
      <div className={classes.discussionContent}>
        <div className={classes.questionTitle}>{title}</div>
        <div className={classes.tagContainer}>
          <div className={classes.tagName}>javascript</div>
          <div className={classes.tagName}>jquery</div>
          <div className={classes.tagName}>vue</div>
        </div>
        <p className={classes.description}>{description}</p>
        <p className={classes.updateInfo}>update 1 min ago</p>
      </div>
      <div className={classes.discussionCount}>
        <div className={classes.column}>
          <div className={classes.num}>{votes}</div>
          <div className={classes.name}>votes</div>
          <Icon path={mdiThumbUpOutline}
            title="vote"
            size={0.8}
            color="#A4A4A4"
          />
        </div>
        <div className={classes.column}>
          <div className={classes.num}>{answers}</div>
          <div className={classes.name}>answers</div>
          <Icon path={mdiForumOutline}
            title="answer"
            size={0.8}
            color="#A4A4A4"
          />
        </div>
        <div className={classes.column}>
          <div className={classes.num}>{views}</div>
          <div className={classes.name}>views</div>
          <Icon path={mdiEyeOutline}
            title="views"
            size={0.8}
            color="#A4A4A4"
          />
        </div>
      </div>
    </div>
  )
};

export default QuestionCard
