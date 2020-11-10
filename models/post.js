'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.user = this.belongsTo(models.user)
    }

    // モデルへのstatic関数追加の確認
    static async newest() {
      return await Post.findAll({ order: [['createdAt', 'DESC']], limit: 5, include: 'user' })
    }

    titleLength() {
      return this.title.length // モデルへの関数追加の確認
    }
  };
  Post.init({
    title: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    body: { 
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'post',
  });
  return Post;
};