'use strict';

const db = require('../index')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authenticator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    async save() {
      await this.validate()
<<<<<<< HEAD
      return await db.user.authenticate({email: this.email, password: this.password})
=======
      return await db.User.authenticate({email: this.email, password: this.password})
>>>>>>> signup and login
    }
  };
  Authenticator.init({
    email: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: null,
  });
  return Authenticator;
};