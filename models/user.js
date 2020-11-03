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
      // define association here
    }

    static async register({ email, password }) {
      const passwordHash = await bcrypt.hash(password, 10)
      const user = this.build({email, password, passwordHash})
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
    modelName: 'User',
  });
  return User;
};