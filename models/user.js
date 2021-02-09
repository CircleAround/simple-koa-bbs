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
    }

    static async generateHash(password) {
      return await bcrypt.hash(password, 10)
    }

    static async register({ nickName, email, password }) {
      const passwordHash = await this.generateHash(password)
      const user = this.build({nickName, email, password, passwordHash})
      await user.save()
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
      if(!user) { throwError() }

      const match = bcrypt.compare(password, user.passwordHash)
      if(!match) { throwError() }
      return user
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