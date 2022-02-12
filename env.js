// Get DB connection details from environment variables
exports.getDBHost = () => {
  return process.env.DB_HOST
}
exports.getDBPort = () => {
  return process.env.DB_PORT
}
exports.getDBUser = () => {
  return process.env.DB_USER
}
exports.getDBPassword = () => {
  return process.env.DB_PASSWORD
}
exports.getDBInstance = () => {
  return process.env.DB_INSTANCE
}
exports.getPort = () => {
  return process.env.PORT
}
exports.getTransporterEmail = () => {
  return process.env.TRANSPORTER_EMAIL
}
exports.getTransporterPassword = () => {
  return process.env.TRANSPORTER_PASSWORD
}