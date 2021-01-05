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

    static async newest(where = {}) {
      // return await Post.findAll({ where, order: [['createdAt', 'DESC']], limit: 5, include: 'user' })

      // const query = `SELECT title, body, "createdAt", "updatedAt" FROM posts WHERE title=$1`
      // return await sequelize.query(query, { model: Post, bind: [where.title] })

      // !!
      let query
      if(where.title) {
        query = `SELECT title, body, "createdAt", "updatedAt" 
        FROM posts 
        WHERE "createdAt" > current_date AND title='${where.title}' 
        ORDER BY "createdAt" desc`
      } else {
        query = `SELECT title, body, "createdAt", "updatedAt" 
        FROM posts 
        WHERE "createdAt" > current_date
        ORDER BY "createdAt" desc`
      }
      return await sequelize.query(query, { model: Post })
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