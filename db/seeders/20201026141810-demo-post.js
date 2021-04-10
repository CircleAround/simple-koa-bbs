'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'Test1',
        body: "これはテストです\nああああ",
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Test2',
        body: "これはテスト2です\nああああ",
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Test3',
        body: "これはテスト3です\nああああ",
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
