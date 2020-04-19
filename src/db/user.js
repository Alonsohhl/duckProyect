var bcrypt = require('bcryptjs')
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
    user.loginPassword = bcrypt.hashSync(user.loginPassword, bcrypt.genSaltSync(10), null)
  })

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

  User.associate = function (models) {
    models.user.hasMany(models.dataFed, { foreignKey: 'id_user' })
  }

  return User
}
