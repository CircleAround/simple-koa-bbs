'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    await queryInterface.createTable('users', {
=======
    await queryInterface.createTable('Users', {
>>>>>>> signup and login
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
<<<<<<< HEAD
      nickName: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
=======
>>>>>>> signup and login
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      passwordHash: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    await queryInterface.dropTable('users');
=======
    await queryInterface.dropTable('Users');
>>>>>>> signup and login
  }
};