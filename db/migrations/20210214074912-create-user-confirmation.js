'use strict';

const fkName = 'user_id_user_confirmations_fk'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_confirmations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      confirmed_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('user_confirmations', { 
      fields: ['user_id'], 
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