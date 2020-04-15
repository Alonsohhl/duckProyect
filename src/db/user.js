var bcrypt = require('bcryptjs')
// const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/envConfig')

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },

    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },
    loginName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    loginPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  })
  // eslint-disable-next-line
  User.prototype.validPassword = function (loginPassword) {
    return bcrypt.compareSync(loginPassword, this.loginPassword)
  }

  User.beforeCreate((user) => {
    user.loginPassword = bcrypt.hashSync(
      user.loginPassword,
      bcrypt.genSaltSync(10),
      null
    )
  })

  //   User.prototype.setPassword = function (password) {
  //     this.salt = crypto.randomBytes(16).toString('hex')
  //     this.hash = crypto
  //       .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
  //       .toString('hex')
  //   }

  //   User.prototype.validatePassword = function (password) {
  //     const hash = crypto
  //       .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
  //       .toString('hex')
  //     return this.hash === hash
  //   }

  User.prototype.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)
    return jwt.sign(
      {
        email: this.loginName,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
      },
      JWT_SECRET
    )
  }

  User.prototype.toAuthJSON = function () {
    return {
      id: this.id,
      user: this.name,
      email: this.mail,
      token: this.generateJWT()
    }
  }

  //   User.associate = function(models) {
  //     models.t01fefm.hasMany(models.T01FCBO, { foreignKey: 'id_Usuario' })
  //   }

  return User
}
