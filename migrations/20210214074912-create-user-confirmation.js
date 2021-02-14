'use strict';

const fkName = 'userId_user_confirmations_fk'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_confirmations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      confirmedAt: {
        type: Sequelize.DATE
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

    await queryInterface.addConstraint('user_confirmations', { 
      fields: ['userId'], 
      type: 'foreign key',
      name: fkName,
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('user_confirmations', fkName)
    await queryInterface.removeIndex('user_confirmations', fkName)
    await queryInterface.dropTable('user_confirmations');
  }
};