'use strict';

const db = require('../app/models/')
const User = db.user

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        nickName: 'ユーザー1',
        email: 'user1@example.com',
        passwordHash: await User.generateHash('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickName: 'ユーザー2',
        email: 'user2@example.com',
        passwordHash: await User.generateHash('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
