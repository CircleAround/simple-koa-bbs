'use strict';

const bcrypt = require('bcrypt')

const {
  Model, ValidationError, ValidationErrorItem
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.posts = this.hasMany(models.post)
      this.UserConfirmations = this.hasMany(models.userConfirmation)
    }

    static async generateHash(password) {
      return await bcrypt.hash(password, 10)
    }

    static async register({ nickName, email, password }) {
      const passwordHash = await this.generateHash(password)
      
      // TODO: 重複は例外になるので、チェックを入れる
      // TODO: パスワードののハッシュは使わないべき。フォーマットちゃんとする
      const confirmationToken = await this.generateHash(Math.random().toString())
      const user = await this.create(
        {
          nickName, email, password, passwordHash,
          user_confirmations: [{
            token: confirmationToken
          }]
        }, {
          include: [ User.UserConfirmations ]
        }
      )
      return user
    }

    static async authenticate({ email, password }) {
      const throwError = () => {
        const error = new ValidationError('ログインに失敗しました', [
          new ValidationErrorItem('メールアドレスとパスワードが一致しません')
        ])
        throw error
      }

      const user = await this.findOne({ where: { email } })
      if (!user) { throwError() }

      const match = bcrypt.compare(password, user.passwordHash)
      if (!match) { throwError() }
      return user
    }

    async lastConfirmation() { 
      const confirmations = await this.getUserConfirmations()
      return (confirmations.length == 0) ? null : confirmations[confirmations.length - 1]
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.VIRTUAL, // for validation checking virtual prop
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};