import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import classes from './Input.module.css'

const Input = (props) => {
  const {
    label,
    prependIcon,
    appendIcon,
    onAppendClick,
    note,
    rules,
    value,
    defaultValue,
    onChange,
    onBlur,
    onInput,
    type = 'text',
    inputRef,
    ...rest
  } = props

  const internalRef = useRef(null)
  const activeRef = inputRef || internalRef

  const [isFocused, setIsFocused] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  // 初始化檢查：如果有 value 或 defaultValue，標籤就該浮起
  const [hasValue, setHasValue] = useState(false)

  // 監控初始值與外部傳入的 value
  useEffect(() => {
    const checkValue = () => {
      if (activeRef.current) {
        setHasValue(activeRef.current.value.length > 0)
      }
    }
    checkValue()
  }, [value, defaultValue])

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    validate(e.target.value)
    if (onBlur) onBlur(e)
  }

  const handleInputInternal = (e) => {
    setHasValue(e.target.value.length > 0)
    if (onInput) onInput(e)
  }

  const handleChange = (e) => {
    if (errorMsg) validate(e.target.value)
    if (onChange) onChange(e)
  }

  const validate = (val) => {
    if (!rules) return true
    for (const rule of rules) {
      const isValid = rule.test(val)
      if (!isValid) {
        setErrorMsg(rule.message)
        return false
      }
    }
    setErrorMsg('')
    return true
  }

  const isLabelFloating = isFocused || hasValue

  const containerClasses = `${classes.inputContainer} ${isFocused ? classes.focused : ''} ${errorMsg ? classes.invalid : ''}`

  const labelClasses = `
    ${classes.label} 
    ${prependIcon ? classes.labelWithPrepend : ''} 
    ${isLabelFloating ? classes.labelActive : ''}
  `.trim()

  // 處理控製組件與非控制組件的屬性
  const inputProps = {
    ...rest,
    ref: activeRef,
    className: classes.input,
    type,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onInput: handleInputInternal,
    onChange: handleChange
  }

  // 如果有傳入 value，則為受控組件；否則使用 defaultValue (非受控)
  if (value !== undefined) {
    inputProps.value = value
  } else if (defaultValue !== undefined) {
    inputProps.defaultValue = defaultValue
  }

  return (
    <div className={classes.inputGroup}>
      <div className={containerClasses}>
        {label && <label className={labelClasses}>{label}</label>}

        {prependIcon && (
          <div className={`${classes.icon} ${classes.prepend}`}>
            <Icon path={prependIcon} size={0.8} />
          </div>
        )}

        <input {...inputProps} />

        {appendIcon && (
          <div
            className={`${classes.icon} ${classes.append}`}
            onClick={onAppendClick}
          >
            <Icon path={appendIcon} size={0.8} />
          </div>
        )}
      </div>

      {errorMsg
        ? (
        <span className={classes.errorText}>{errorMsg}</span>
          )
        : (
            note && <span className={classes.note}>{note}</span>
          )}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  prependIcon: PropTypes.string,
  appendIcon: PropTypes.string,
  onAppendClick: PropTypes.func,
  note: PropTypes.string,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      test: PropTypes.func.isRequired,
      message: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
  type: PropTypes.string,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
}

export default Input
