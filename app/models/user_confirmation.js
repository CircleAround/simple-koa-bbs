'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConfirmation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.user = this.belongsTo(models.user)
    }

    async succeed() {
      this.confirmedAt = new Date()
      return await this.save()
    }
  };
  UserConfirmation.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    token: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    confirmedAt:  { 
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'userConfirmation',
    tableName: 'user_confirmations'
  });
  return UserConfirmation;
};