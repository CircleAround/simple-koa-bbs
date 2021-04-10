'use strict';

const db = require('../../app/models')
const User = db.user

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        nick_name: 'ユーザー1',
        email: 'user1@example.com',
        password_hash: await User.generateHash('password'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nick_name: 'ユーザー2',
        email: 'user2@example.com',
        password_hash: await User.generateHash('password'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
