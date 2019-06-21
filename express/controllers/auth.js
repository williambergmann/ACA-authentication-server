const crypto = require('crypto')
const { AuthModel } = require('../../mongo/models')

const SignUp = ({ userName, password }) => {
  if (!userName || !password) return Promise.reject('username and password are required!')
  const hash = crypto.createHash('md5').update(password).digest("hex")
  return AuthModel.create({ userName, password: hash })
}

const Login = ({ userName, password }) => {
  const hash = crypto.createHash('md5').update(password).digest("hex")
  return AuthModel.findOne({ userName, password: hash })
}

const UpdateUser = (user, userName) => {
  return AuthModel.updateOne({ _id: user._id }, { $set: { userName }})
}

const UpdatePassword = (user, password) => {
  const hash = crypto.createHash('md5').update(password).digest("hex")
  return AuthModel.updateOne({ _id: user._id }, { $set: { password: hash }})
}

module.exports = {
  SignUp,
  Login,
  UpdateUser,
  UpdatePassword
}