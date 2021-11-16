const returner = (name, { status, message},res) => {
  res.status(status).json({
    api_name:name,
    message:message
  })
}
module.exports = returner