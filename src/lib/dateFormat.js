const pad = (num) => String(num).padStart(2, '0')

const formatDate = (dateTime) =>
  `${dateTime.getFullYear()}-${pad(dateTime.getMonth() + 1)}-${pad(dateTime.getDate())} ` +
  `${pad(dateTime.getHours())}:${pad(dateTime.getMinutes())}`

export default formatDate
