'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Posts', [{
       title: 'Test',
       body: "これはテストです\nああああ",
       createdAt: new Date(),
       updatedAt: new Date()
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Posts', null, {});
  }
};
