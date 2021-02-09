'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'Test1',
        body: "これはテストです\nああああ",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Test2',
        body: "これはテスト2です\nああああ",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Test3',
        body: "これはテスト3です\nああああ",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
