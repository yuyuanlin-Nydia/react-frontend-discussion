const formatDate = (dateTime) => {
  const month = dateTime.getMonth() + 1
  const date = dateTime.getDate()
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()

  const monthNew = month + 1 < 10 ? '0' + month : month
  const dateNew = date + 1 < 10 ? '0' + date : date
  const hourNew = hours + 1 < 10 ? '0' + hours : hours
  const minuteNew = minutes + 1 < 10 ? '0' + minutes : minutes
  const formattedDate =
    dateTime.getFullYear() +
    '-' +
    monthNew +
    '-' +
    dateNew +
    ' ' +
    hourNew +
    ':' +
    minuteNew
  return formattedDate
}

export default formatDate
